// index.js (api-gateway)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const BFF_URL = process.env.BFF_URL || 'http://localhost:3000';

app.use(cors());

// Log de entrada
app.use((req, res, next) => {
    console.log(`[Gateway] -> Recebida: ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'Gateway Online' });
});

// --- CONFIGURAÇÃO DO PROXY ---
// Mudança: Removemos o '/api' do app.use para o Express não "comer" o prefixo.
// O filtro '/api' agora fica DENTRO da configuração do proxy (context matching).
const apiProxy = createProxyMiddleware({
    target: BFF_URL,
    changeOrigin: true,
    pathFilter: '/api', // Só faz proxy se a URL começar com /api
    onError: (err, req, res) => {
        console.error('[Gateway] Erro:', err.message);
        res.status(500).send('Erro no Gateway');
    }
});

// Montamos na raiz ('/') para preservar a URL completa
app.use(apiProxy);

app.listen(port, () => {
    console.log(`API Gateway rodando na porta ${port}`);
    console.log(`Alvo do Proxy (BFF): ${BFF_URL}`);
});