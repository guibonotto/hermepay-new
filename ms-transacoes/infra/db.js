// infra/db.js
const { Connection, Request } = require('tedious');

function parseSqlConnectionString(connectionString) {
    const config = {};
    // CORREÇÃO AQUI: Adicionamos (connectionString || '')
    const parts = (connectionString || '').split(';');
    
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

// Adiciona valores padrão para não quebrar se o config estiver vazio no teste
const config = {
    server: dbConfig.server || 'localhost',
    authentication: { type: 'default', options: { userName: dbConfig.userName || 'user', password: dbConfig.password || 'pass' }},
    options: { database: dbConfig.database || 'db', encrypt: true, port: 1433, rowCollectionOnRequestCompletion: true }
};

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);
        connection.on('connect', (err) => {
            if (err) return reject(err);
            const request = new Request(query, (err, rowCount, rows) => {
                connection.close();
                if (err) return reject(err);
                const result = rows.map(row => {
                    const obj = {};
                    row.forEach(col => { obj[col.metadata.colName] = col.value; });
                    return obj;
                });
                resolve({ rowCount, rows: result });
            });
            params.forEach(p => request.addParameter(p.name, p.type, p.value));
            connection.execSql(request);
        });
        connection.connect();
    });
}

module.exports = { runQuery };