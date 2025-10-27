// routes/storeProxyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Pegamos a URL base do nosso microserviço de lojas do .env
const STORES_API_URL = process.env.SERVICE_LOJAS_URL; // Ex: http://localhost:3001

// Rota 1: READ ALL (GET /api/stores)
router.get('/', async (req, res) => {
    try {
        // Repassa a requisição GET para o ms-lojas
        const response = await axios.get(`${STORES_API_URL}/api/stores`);
        // Devolve a resposta do microserviço para o frontend
        res.status(response.status).json(response.data);
    } catch (error) {
        // Se o microserviço der erro, repassa o erro
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 2: READ ONE (GET /api/stores/:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${STORES_API_URL}/api/stores/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 3: CREATE (POST /api/stores)
router.post('/', async (req, res) => {
    try {
        // Repassa a requisição POST (e o corpo 'req.body') para o ms-lojas
        const response = await axios.post(`${STORES_API_URL}/api/stores`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 4: UPDATE (PUT /api/stores/:id)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`${STORES_API_URL}/api/stores/${id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

// Rota 5: DELETE (DELETE /api/stores/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${STORES_API_URL}/api/stores/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

module.exports = router;