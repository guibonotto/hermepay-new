// src/functions/CreateTransactionTrigger.js

const { app } = require('@azure/functions');
const { ServiceBusClient } = require('@azure/service-bus');

app.http('CreateTransactionTrigger', {
    methods: ['GET', 'POST'], 
    authLevel: 'anonymous',
    
    handler: async (request, context) => {
        
        if (request.method === 'GET') {
            // ... (o código do GET continua igual)
        }

        // --- LÓGICA DO POST (MODIFICADA) ---
        context.log('Função HTTP Trigger "CreateTransactionTrigger" (v4) foi acionada com POST.');

        try {
            const transactionData = await request.json(); 

            if (!transactionData || !transactionData.value || !transactionData.store_id) {
                // ... (o código de validação 400 continua igual)
            }

            // ***** INÍCIO DA NOVA LÓGICA DE GATEWAY *****

            let paymentStatus = 'approved'; // Começa como aprovado

            // Simulação de Regra de Negócio: Recusar pagamentos acima de 500
            if (transactionData.value > 500) {
                paymentStatus = 'failed';
                context.log(`Pagamento RECUSADO (Simulado): Valor ${transactionData.value} acima de 500.`);
            } else {
                context.log(`Pagamento APROVADO (Simulado): Valor ${transactionData.value}.`);
            }

            // Adicionamos o status final ao objeto da transação
            const messageBody = {
                ...transactionData, // Pega os dados originais (value, store_id, payer_email)
                status: paymentStatus // Adiciona o status real
            };

            // ***** FIM DA NOVA LÓGICA DE GATEWAY *****

            const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
            const topicName = process.env.SERVICE_BUS_TOPIC_NAME;

            const serviceBusClient = new ServiceBusClient(connectionString);
            const sender = serviceBusClient.createSender(topicName);

            const message = {
                body: messageBody, // Enviamos o corpo da mensagem com o novo status
                contentType: "application/json"
            };

            await sender.sendMessages(message);
            context.log('Mensagem enviada para o tópico:', topicName);

            await sender.close();
            await serviceBusClient.close();
            
            // Se o pagamento falhou na nossa simulação, retornamos um erro 400 (Bad Request)
            if (paymentStatus === 'failed') {
                return {
                    status: 400, // Bad Request (ou 402 Payment Required)
                    jsonBody: { message: "Pagamento recusado pelo gateway." }
                };
            }

            // Se foi aprovado, retornamos 202 Accepted
            return {
                status: 202,
                jsonBody: { message: "Transação recebida e enfileirada para processamento." }
            };

        } catch (error) {
            // ... (o código de erro 500 continua igual)
        }
    }
});