// config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MS-Usuarios conectado ao MongoDB Atlas com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar o MS-Usuarios ao MongoDB Atlas:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;