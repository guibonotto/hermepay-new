// controllers/authController.js

const User = require('../models/User'); // Importa nosso Model
const jwt = require('jsonwebtoken'); // Importa a biblioteca JWT
const axios = require('axios')
require('dotenv').config(); // Para pegar o JWT_SECRET

// --- 1. FUNÇÃO DE REGISTRO ---
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validação básica
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        }

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        // --- 2. CHAMADA AO MS-LOJAS PARA CRIAR UMA LOJA ---
        let newStoreId;
        try {
            // Vamos criar uma loja com o nome "Loja de [Nome do Usuário]"
            const storeResponse = await axios.post(`${process.env.SERVICE_LOJAS_URL}/api/stores`, {
                name: `Loja de ${name}`
            });
            
            newStoreId = storeResponse.data._id;
            console.log('Loja criada automaticamente:', newStoreId);

        } catch (storeError) {
            console.error('Erro ao criar loja automática:', storeError.message);
            return res.status(500).json({ message: 'Erro ao criar a loja para o usuário.' });
        }

        // --- 3. CRIA O USUÁRIO VINCULADO À LOJA ---
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            store: newStoreId // <-- VINCULA O ID DA LOJA RECÉM-CRIADA
        });

        await newUser.save();

        res.status(201).json({
            message: 'Usuário e Loja registrados com sucesso!',
            userId: newUser._id,
            name: newUser.name,
            email: newUser.email,
            storeId: newUser.store
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

// --- 2. FUNÇÃO DE LOGIN ---
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha e-mail e senha.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            storeId: user.store
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
};

// --- 3. FUNÇÃO DE BUSCAR "EU" (ME) ---
// (Esta é a função que estava faltando!)
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do usuário', error: error.message });
    }
};