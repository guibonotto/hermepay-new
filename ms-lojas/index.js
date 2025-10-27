// index.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');

// Importa nossas novas rotas
const storeRoutes = require('./routes/storeRoutes'); 

connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Rota de Teste (Olá, Mundo)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API do Microserviço de Lojas (MS-Lojas) está online!'
    });
});

// ***** NOVA LINHA *****
// Diz ao Express para usar nossas rotas de loja
// Todas as rotas em 'storeRoutes' terão o prefixo '/api/stores'
app.use('/api/stores', storeRoutes);


// Iniciar o servidor
app.listen(port, () => {
    console.log(`MS-Lojas está rodando com sucesso na porta ${port}`);
});