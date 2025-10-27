// controllers/transactionController.js

// Vamos precisar de um pool de conexão para fazer várias consultas
// É mais eficiente do que criar uma conexão nova a cada requisição.
// Vamos configurar isso no index.js e passar para cá.
// Por enquanto, vamos apenas escrever a lógica.

const { Connection, Request, TYPES } = require('tedious');

// --- Função para 'parsear' a string de conexão ---
function parseSqlConnectionString(connectionString) {
    const config = {};
    const parts = connectionString.split(';');
    parts.forEach(part => {
        const pair = part.split('=');
        if (pair.length === 2) {
            const key = pair[0].trim();
            const value = pair[1].trim();
            if (key.toLowerCase() === 'server') config.server = value.replace('tcp:', '').split(',')[0];
            if (key.toLowerCase() === 'initial catalog') config.database = value;
            if (key.toLowerCase() === 'user id') config.userName = value;
            if (key.toLowerCase() === 'password') config.password = value;
        }
    });
    return config;
}

const dbConfig = parseSqlConnectionString(process.env.AZURE_SQL_CONNECTION_STRING);
const config = {
    server: dbConfig.server,
    authentication: { type: 'default', options: { userName: dbConfig.userName, password: dbConfig.password }},
    options: { database: dbConfig.database, encrypt: true, port: 1433, rowCollectionOnRequestCompletion: true } // rowCollectionOnRequestCompletion é importante para pegar os resultados
};

// Função auxiliar para conectar e rodar uma query
function runQuery(context, query, params = []) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);
        
        connection.on('connect', (err) => {
            if (err) {
                context.log.error('Erro ao conectar ao Azure SQL:', err.message);
                return reject(err);
            }
            
            const request = new Request(query, (err, rowCount, rows) => {
                connection.close();
                if (err) {
                    context.log.error('Erro ao executar a query SQL:', err);
                    return reject(err);
                }
                // Converte o resultado (que é complexo) para um JSON simples
                const result = rows.map(row => {
                    const obj = {};
                    row.forEach(col => {
                        obj[col.metadata.colName] = col.value;
                    });
                    return obj;
                });
                resolve({ rowCount, rows: result });
            });

            // Adiciona parâmetros
            params.forEach(p => {
                request.addParameter(p.name, p.type, p.value);
            });

            connection.execSql(request);
        });

        connection.connect();
    });
}

// READ ALL (GET /transactions)
exports.getAllTransactions = async (req, res) => {
    try {
        // Filtra para não mostrar as que foram "soft-deleted"
        const query = "SELECT * FROM transactions WHERE deletedAt IS NULL;";
        const { rows } = await runQuery({ log: console, log: { error: console.error } }, query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar transações', error: error.message });
    }
};

// READ ONE (GET /transactions/:id)
exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM transactions WHERE id = @id AND deletedAt IS NULL;";
        const params = [{ name: 'id', type: TYPES.Int, value: id }];
        
        const { rows } = await runQuery({ log: console, log: { error: console.error } }, query, params);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar transação', error: error.message });
    }
};

// DELETE (SOFT DELETE) (DELETE /transactions/:id)
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        // Atualiza a coluna 'deletedAt' para a data/hora atual
        const query = "UPDATE transactions SET deletedAt = GETUTCDATE() WHERE id = @id AND deletedAt IS NULL;";
        const params = [{ name: 'id', type: TYPES.Int, value: id }];

        const { rowCount } = await runQuery({ log: console, log: { error: console.error } }, query, params);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Transação não encontrada para deletar.' });
        }
        // Retorna 204 No Content (sucesso, sem corpo)
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
    }
};