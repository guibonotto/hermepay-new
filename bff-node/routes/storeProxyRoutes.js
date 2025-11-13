// routes/storeProxyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const STORES_API_URL = process.env.SERVICE_LOJAS_URL;

// Função auxiliar para tratar erros do Axios
const { handleAxiosError } = require('../utils/proxyHelpers');

// --- ROTAS GERAIS ---
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${STORES_API_URL}/api/stores`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});
router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${STORES_API_URL}/api/stores`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});

// --- ROTAS DE CONTAS BANCÁRIAS ---
router.get('/:id/accounts', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${STORES_API_URL}/api/stores/${id}/accounts`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});
router.post('/:id/accounts', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.post(`${STORES_API_URL}/api/stores/${id}/accounts`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});
router.delete('/:id/accounts/:accountId', async (req, res) => {
    try {
        const { id, accountId } = req.params;
        // Repassa a chamada DELETE para o ms-lojas
        const response = await axios.delete(`${STORES_API_URL}/api/stores/${id}/accounts/${accountId}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // Usando nosso handler de erro
    }
});
// Rota: LISTAR webhooks (GET /api/stores/:id/webhooks)
router.get('/:id/webhooks', async (req, res) => {
    try {
        const { id } = req.params;
        // Repassa a chamada para o ms-lojas
        const response = await axios.get(`${STORES_API_URL}/api/stores/${id}/webhooks`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // Usando nosso handler de erro
    }
});

// Rota: ADICIONAR webhook (POST /api/stores/:id/webhooks)
router.post('/:id/webhooks', async (req, res) => {
    try {
        const { id } = req.params;
        // Repassa a chamada (e o body) para o ms-lojas
        const response = await axios.post(`${STORES_API_URL}/api/stores/${id}/webhooks`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // Usando nosso handler de erro
    }
});
// --- ROTAS DE LOJA INDIVIDUAL ---
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${STORES_API_URL}/api/stores/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`${STORES_API_URL}/api/stores/${id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${STORES_API_URL}/api/stores/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res); // <-- CORRIGIDO
    }
});

module.exports = router;