// routes/authProxyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { handleAxiosError } = require('../utils/proxyHelpers'); // (Vamos criar isso no próximo passo)

const USUARIOS_API_URL = process.env.SERVICE_USUARIOS_URL; // Ex: http://localhost:3003

// Rota: Registrar (POST /api/auth/register)
router.post('/register', async (req, res) => {
    try {
        // Repassa a requisição POST (e o body) para o ms-usuarios
        const response = await axios.post(`${USUARIOS_API_URL}/api/auth/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res);
    }
});

// Rota: Login (POST /api/auth/login)
router.post('/login', async (req, res) => {
    try {
        // Repassa a requisição POST (e o body) para o ms-usuarios
        const response = await axios.post(`${USUARIOS_API_URL}/api/auth/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res);
    }
});

router.get('/me', async (req, res) => {
    try {
        // CRUCIAL: Precisamos pegar o token "Bearer ..." que o Angular enviou
        // e repassá-lo para o microserviço.
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Nenhum token fornecido pelo proxy.' });
        }

        // Repassa a requisição GET para o ms-usuarios,
        // enviando o cabeçalho de Autorização original
        const response = await axios.get(`${USUARIOS_API_URL}/api/auth/me`, {
            headers: {
                'Authorization': token
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        handleAxiosError(error, res);
    }
});

module.exports = router;