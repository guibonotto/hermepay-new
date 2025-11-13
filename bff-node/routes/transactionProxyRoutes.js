// routes/transactionProxyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const TRANSACOES_API_URL = process.env.SERVICE_TRANSACOES_URL;
const FUNCTION_CREATE_URL = process.env.FUNCTION_CREATE_TRANSACTION_URL;

// Função auxiliar para tratar erros do Axios
const { handleAxiosError } = require('../utils/proxyHelpers');

// Rota 1: CREATE (POST /)
router.post('/', async (req, res) => {
    try {
        const response = await axios.post(FUNCTION_CREATE_URL, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});

// Rota 2: READ ALL (GET /)
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization; // Pega o token do Angular
        const response = await axios.get(`${TRANSACOES_API_URL}/api/transactions`, {
            headers: { 'Authorization': token } // Repassa o token
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});

// Rota: STATS (GET /stats)
router.get('/stats', async (req, res) => {
    try {
        const token = req.headers.authorization; // <--- PEGA O TOKEN
        const response = await axios.get(`${TRANSACOES_API_URL}/api/transactions/stats`, {
            headers: { 'Authorization': token } // <--- ENVIA O TOKEN
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res);
    }
});

// Rota 3: READ ONE (GET /:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${TRANSACOES_API_URL}/api/transactions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO (Este era o que crashava)
    }
});

// Rota 4: DELETE (DELETE /:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${TRANSACOES_API_URL}/api/transactions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});

module.exports = router;