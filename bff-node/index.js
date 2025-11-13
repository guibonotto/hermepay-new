// index.js (bff-node)
const express = require('express');
require('dotenv').config();
const cors = require('cors'); // 1. Importe o pacote cors

const storeProxyRoutes = require('./routes/storeProxyRoutes');
const transactionProxyRoutes = require('./routes/transactionProxyRoutes');
const aggregatorRoutes = require('./routes/aggregatorRoutes');
const authProxyRoutes = require('./routes/authProxyRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 2. Use o middleware cors ANTES das suas rotas
// Isso adicionará os cabeçalhos 'Access-Control-Allow-Origin: *' por padrão,
// permitindo requisições de qualquer origem (ótimo para desenvolvimento).
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API do BFF (Backend for Frontend) está online!'
    });
});

// --- NOSSAS ROTAS ---
app.use('/api/stores', storeProxyRoutes);
app.use('/api/transactions', transactionProxyRoutes);
app.use('/api', aggregatorRoutes);
app.use('/api/auth', authProxyRoutes);

app.listen(port, () => {
    console.log(`BFF está rodando com sucesso na porta ${port}`);
});