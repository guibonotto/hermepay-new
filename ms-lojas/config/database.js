// config/database.js

const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Pegamos a string de conexão do nosso arquivo .env
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        // Tenta conectar ao banco de dados
        await mongoose.connect(mongoURI);
        console.log('MongoDB Atlas conectado com sucesso!');
    } catch (err) {
        // Se der erro, exibe o erro e encerra a aplicação
        console.error('Erro ao conectar ao MongoDB Atlas:', err.message);
        process.exit(1); // Encerra o processo com falha
    }
};

// Exportamos a função para que ela possa ser usada em outros arquivos
module.exports = connectDB;