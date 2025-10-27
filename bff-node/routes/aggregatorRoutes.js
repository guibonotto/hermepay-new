// routes/aggregatorRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Pega as URLs dos nossos serviços do .env
const STORES_API_URL = process.env.SERVICE_LOJAS_URL; // http://localhost:3001
const FUNCTION_URL = process.env.FUNCTION_CREATE_TRANSACTION_URL; // http://localhost:7071/api/CreateTransactionTrigger

router.get('/dashboard', async (req, res) => {
    try {
        // 1. Prepara as duas chamadas de API, em paralelo
        const promiseLojas = axios.get(`${STORES_API_URL}/api/stores`);
        const promiseFunction = axios.get(FUNCTION_URL);

        // 2. Aguarda que AMBAS as chamadas terminem (Promise.all)
        const [respostaLojas, respostaFunction] = await Promise.all([
            promiseLojas,
            promiseFunction
        ]);

        // 3. Agrega (junta) os resultados
        const dashboardData = {
            statusServicos: {
                lojas: {
                    status: 'Online',
                    statusCode: respostaLojas.status
                },
                funcaoMensageria: {
                    status: respostaFunction.data.status, // Pega o "Online" da função
                    statusCode: respostaFunction.status
                }
            },
            dadosLojas: respostaLojas.data // Pega a lista de lojas
        };

        // 4. Retorna a resposta única e agregada
        res.status(200).json(dashboardData);

    } catch (error) {
        // Se QUALQUER uma das chamadas falhar, retorna um erro
        res.status(500).json({ 
            message: 'Erro ao agregar dados do dashboard', 
            error: error.message 
        });
    }
});

module.exports = router;