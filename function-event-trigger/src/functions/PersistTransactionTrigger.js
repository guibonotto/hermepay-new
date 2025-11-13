// src/functions/PersistTransactionTrigger.js

const { app } = require('@azure/functions');
const { Connection, Request, TYPES } = require('tedious');

app.serviceBusTopic('PersistTransactionTrigger', {
    connection: 'SERVICE_BUS_CONNECTION_STRING',
    topicName: 'transacoes-topic',
    subscriptionName: 'fn2-persiste-banco',

    handler: async (serviceBusMessage, context) => {
        context.log('Função "PersistTransactionTrigger" acionada por evento do Service Bus.');

        const transactionData = serviceBusMessage;
        context.log('Dados recebidos:', transactionData);

        // Validação
        if (!transactionData || !transactionData.value || !transactionData.store_id || !transactionData.status) {
            context.error('Mensagem do Service Bus inválida ou incompleta.');
            return; 
        }

        const sqlConnectionString = process.env.AZURE_SQL_CONNECTION_STRING;

        // Função auxiliar para ler a string de conexão
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

        const dbConfig = parseSqlConnectionString(sqlConnectionString);

        const config = {
            server: dbConfig.server,
            authentication: {
                type: 'default',
                options: {
                    userName: dbConfig.userName,
                    password: dbConfig.password
                }
            },
            options: {
                database: dbConfig.database,
                encrypt: true,
                port: 1433
            }
        };

        const connection = new Connection(config);

        // Conexão assíncrona
        await new Promise((resolve, reject) => {
            connection.on('connect', (err) => {
                if (err) {
                    context.error('Erro ao conectar ao Azure SQL:', err.message);
                    reject(err);
                } else {
                    context.log('Conectado ao Azure SQL com sucesso.');
                    executeStatement(resolve, reject);
                }
            });

            connection.connect();
        });

        function executeStatement(resolve, reject) {
            // Query SQL atualizada com as novas colunas
            const request = new Request(`
                INSERT INTO transactions (store_id, payer_email, value, status, products_json, external_order_id) 
                VALUES (@store_id, @payer_email, @value, @status, @products, @order_id);
            `, (err) => {
                if (err) {
                    context.error('Erro ao executar o INSERT SQL:', err);
                    reject(err);
                } else {
                    context.log('Dados da transação persistidos no Azure SQL.');
                    connection.close();
                    resolve(); 
                }
            });

            // Prepara o JSON de produtos (garante que seja string e não undefined)
            const productsString = JSON.stringify(transactionData.products || []);

            // --- ADICIONANDO PARÂMETROS ---
            
            // 1. CORREÇÃO CRUCIAL: store_id deve ser VarChar (Texto), não Int
            request.addParameter('store_id', TYPES.VarChar, transactionData.store_id);
            
            request.addParameter('payer_email', TYPES.VarChar, transactionData.payer_email);
            request.addParameter('value', TYPES.Decimal, transactionData.value);
            request.addParameter('status', TYPES.VarChar, transactionData.status);
            
            // Novos parâmetros
            request.addParameter('products', TYPES.NVarChar, productsString);
            request.addParameter('order_id', TYPES.VarChar, transactionData.external_order_id || null);

            connection.execSql(request);
        }
    }
});