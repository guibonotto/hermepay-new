// routes/transactionProxyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Pegamos as URLs dos nossos serviços do .env
const TRANSACOES_API_URL = process.env.SERVICE_TRANSACOES_URL; // Ex: http://localhost:3002
const FUNCTION_CREATE_URL = process.env.FUNCTION_CREATE_TRANSACTION_URL; // Ex: http://localhost:7071/api/CreateTransactionTrigger

// Rota 1: CREATE (POST /api/transactions)
// ESTA É A ROTA ESPECIAL (padrão de evento)
router.post('/', async (req, res) => {
    try {
        // Repassa a requisição POST para a FUNCTION 1 (Mensageiro)
        const response = await axios.post(FUNCTION_CREATE_URL, req.body);
        // A function deve retornar 202 Accepted
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 2: READ ALL (GET /api/transactions)
router.get('/', async (req, res) => {
    try {
        // Repassa a requisição GET para o MS-Transações (Leitor)
        const response = await axios.get(`${TRANSACOES_API_URL}/api/transactions`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 3: READ ONE (GET /api/transactions/:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TRANSACOES_API_URL}/api/transactions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 4: DELETE (DELETE /api/transactions/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${TRANSACOES_API_URL}/api/transactions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

module.exports = router;