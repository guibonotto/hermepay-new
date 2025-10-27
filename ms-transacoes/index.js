// index.js (ms-transacoes)
const express = require('express');
require('dotenv').config();

// Importa nossas novas rotas
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 3002; // Rodando na porta 3002

app.use(express.json());

// Rota de Teste
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'API do Microserviço de Transações (MS-Transações) está online!' 
    });
});

// ***** NOVA LINHA *****
// Diz ao Express para usar nossas rotas de transação
// com o prefixo /api/transactions
app.use('/api/transactions', transactionRoutes);


app.listen(port, () => {
    console.log(`MS-Transações está rodando com sucesso na porta ${port}`);
});