const { app } = require('@azure/functions');
const { ServiceBusClient } = require('@azure/service-bus');
const axios = require('axios'); // Necessário para chamar a Cielo

app.http('CreateTransactionTrigger', {
    methods: ['GET', 'POST'], 
    authLevel: 'anonymous',
    
    handler: async (request, context) => {
        
        // --- LÓGICA DO GET (Health Check) ---
        if (request.method === 'GET') {
            return {
                status: 200,
                jsonBody: {
                    service: 'fn-http-trigger (Mensageiro)',
                    status: 'Online - Integrado com Cielo Sandbox'
                }
            };
        }

        // --- LÓGICA DO POST (PROCESSAMENTO) ---
        context.log('Função HTTP Trigger "CreateTransactionTrigger" acionada com POST.');

        try {
            const transactionData = await request.json(); 

            // Validação básica dos dados de entrada
            if (!transactionData || !transactionData.value || !transactionData.store_id) {
                return {
                    status: 400,
                    jsonBody: { message: "Dados inválidos. Envie 'value' e 'store_id'." }
                };
            }

            // ***** INÍCIO DA INTEGRAÇÃO CIELO *****

            // COLOQUE SUAS CHAVES DA CIELO AQUI (Pegue em cadastrosandbox.cieloecommerce.cielo.com.br)
            const MERCHANT_ID = '908ee826-e141-4e40-af2e-810cd60cbc70'; 
            const MERCHANT_KEY = 'ScfZpmvGXbihwduPVa4mjN8E9PGgTc4RvII38yDV';

            let paymentStatus = 'pending';
            let externalId = null;

            try {
                // 1. Monta o Payload para a Cielo
                const cieloPayload = {
                    "MerchantOrderId": `PEDIDO-${Date.now()}`,
                    "Customer": {
                        "Name": "Cliente Teste" // Poderia vir do transactionData
                    },
                    "Payment": {
                      "Type": "CreditCard",
                      "Amount": Math.round(transactionData.value * 100), // Cielo usa centavos (R$ 10,00 = 1000)
                      "Installments": 1,
                      "CreditCard": {
                        // Se o frontend não mandar cartão, usamos um de teste da Cielo (Visa)
                        "CardNumber": transactionData.card_number || "4539123456789012",
                        "Holder": transactionData.card_holder || "TESTE HOLDER",
                        "ExpirationDate": transactionData.card_expiration || "12/2030",
                        "SecurityCode": "123",
                        "Brand": "Visa"
                      }
                    }
                };

                context.log('Enviando requisição para Cielo...');

                // 2. Faz a chamada para a API da Cielo
                const response = await axios.post('https://apisandbox.cieloecommerce.cielo.com.br/1/sales/', cieloPayload, {
                    headers: {
                        'MerchantId': MERCHANT_ID,
                        'MerchantKey': MERCHANT_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                const cieloData = response.data;
                externalId = cieloData.Payment.PaymentId; // ID da transação na Cielo

                // 3. Verifica o Status (2 = Pagamento Confirmado)
                if (cieloData.Payment.Status === 2) {
                    paymentStatus = 'approved';
                    context.log('Cielo: Pagamento Aprovado!');
                } else {
                    paymentStatus = 'failed';
                    context.log(`Cielo: Pagamento não autorizado. Status: ${cieloData.Payment.Status}`);
                }

            } catch (cieloError) {
                // Se der erro na API da Cielo (ex: chaves erradas ou cartão inválido)
                console.error('Erro na Cielo:', cieloError.response ? cieloError.response.data : cieloError.message);
                paymentStatus = 'error_processing';
            }

            // ***** FIM DA INTEGRAÇÃO CIELO *****

            // Monta a mensagem para o Service Bus com o status REAL
            const messageBody = {
                ...transactionData,
                status: paymentStatus,
                external_order_id: externalId // Salvamos o ID da Cielo para referência futura
            };

            // Envia para a Fila (Service Bus) para ser salvo no banco assincronamente
            const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
            const topicName = process.env.SERVICE_BUS_TOPIC_NAME;

            const serviceBusClient = new ServiceBusClient(connectionString);
            const sender = serviceBusClient.createSender(topicName);

            const message = {
                body: messageBody,
                contentType: "application/json"
            };

            await sender.sendMessages(message);
            context.log('Resultado enviado para o Service Bus:', paymentStatus);

            await sender.close();
            await serviceBusClient.close();
            
            // Resposta para o Frontend
            if (paymentStatus === 'failed' || paymentStatus === 'error_processing') {
                return {
                    status: 400, // Bad Request
                    jsonBody: { message: "Pagamento recusado pela operadora.", status: paymentStatus }
                };
            }

            // Sucesso
            return {
                status: 202, // Accepted
                jsonBody: { 
                    message: "Pagamento aprovado e em processamento.", 
                    status: paymentStatus,
                    transactionId: externalId
                }
            };

        } catch (error) {
            context.log.error("Erro interno na Function:", error);
            return {
                status: 500,
                jsonBody: { message: "Erro interno no servidor." }
            };
        }
    }
});