// src/functions/CreateTransactionTrigger.js

const { app } = require('@azure/functions');
const { ServiceBusClient } = require('@azure/service-bus');

app.http('CreateTransactionTrigger', {
    methods: ['GET', 'POST'], // <--- AGORA ACEITA GET E POST
    authLevel: 'anonymous',
    
    handler: async (request, context) => {
        
        // --- NOVO BLOCO PARA TRATAR O GET ---
        if (request.method === 'GET') {
            context.log('Função "CreateTransactionTrigger" acionada com GET (Health Check).');
            return {
                status: 200,
                jsonBody: {
                    service: 'fn-http-trigger (Mensageiro)',
                    status: 'Online'
                }
            };
        }
        // --- FIM DO NOVO BLOCO ---

        // O código do POST continua o mesmo abaixo
        context.log('Função HTTP Trigger "CreateTransactionTrigger" (v4) foi acionada com POST.');

        try {
            const transactionData = await request.json(); 

            if (!transactionData || !transactionData.value || !transactionData.store_id) {
                // ... (o resto do seu código 'POST' continua igual)...
            }

            // ... (o resto do seu código 'POST' continua igual)...
            
            return {
                status: 202,
                jsonBody: { message: "Transação recebida e enfileirada para processamento." }
            };

        } catch (error) {
            // ... (o resto do seu código 'POST' continua igual)...
        }
    }
});