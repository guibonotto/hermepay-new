// index.js (ms-usuarios)
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes'); // <-- 1. ADICIONE ESTA LINHA

// Conecta ao banco de dados
connectDB();

const app = express();
// Vamos rodar este serviço na porta 3003
const port = process.env.PORT || 3003; 

// Middleware para entender JSON
app.use(express.json());

// Rota de Teste
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'API do Microserviço de Usuários (MS-Usuarios) está online!' 
    });
});
// Qualquer chamada para /api/auth/... será gerenciada pelo 'authRoutes'
app.use('/api/auth', authRoutes); // <-- 2. ADICIONE ESTA LINHA
// Iniciar o servidor
app.listen(port, () => {
    console.log(`MS-Usuarios está rodando com sucesso na porta ${port}`);
});