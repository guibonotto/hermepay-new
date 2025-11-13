const express = require('express');
require('dotenv').config();
const authMiddleware = require('./middleware/authMiddleware');

// Importando as Features (Fatias)
const getTransactions = require('./features/get-transactions');
const getStats = require('./features/get-stats');
const deleteTransaction = require('./features/delete-transaction');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Rotas diretas para as Features
app.get('/api/transactions', authMiddleware, getTransactions);
app.get('/api/transactions/stats', authMiddleware, getStats);
app.delete('/api/transactions/:id', deleteTransaction); // (Pode adicionar authMiddleware aqui se quiser)

app.listen(port, () => {
    console.log(`MS-Transações (Vertical Slice) rodando na porta ${port}`);
});