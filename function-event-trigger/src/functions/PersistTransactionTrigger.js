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

        if (!transactionData || !transactionData.value || !transactionData.store_id) {
            // CORREÇÃO AQUI
            context.error('Mensagem do Service Bus inválida ou incompleta.');
            return; 
        }

        const sqlConnectionString = process.env.AZURE_SQL_CONNECTION_STRING;

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

        await new Promise((resolve, reject) => {
            connection.on('connect', (err) => {
                if (err) {
                    // CORREÇÃO AQUI
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
            const request = new Request(`
                INSERT INTO transactions (store_id, payer_email, value) 
                VALUES (@store_id, @payer_email, @value);
            `, (err) => {
                if (err) {
                    // CORREÇÃO AQUI
                    context.error('Erro ao executar o INSERT SQL:', err);
                    reject(err);
                } else {
                    context.log('Dados da transação persistidos no Azure SQL.');
                    connection.close();
                    resolve(); 
                }
            });

            request.addParameter('store_id', TYPES.Int, transactionData.store_id);
            request.addParameter('payer_email', TYPES.VarChar, transactionData.payer_email);
            request.addParameter('value', TYPES.Decimal, transactionData.value);

            connection.execSql(request);
        }
    }
});