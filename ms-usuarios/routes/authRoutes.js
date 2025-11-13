// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para Registrar (POST /api/auth/register)
router.post('/register', authController.registerUser);

// Rota para Logar (POST /api/auth/login)
router.post('/login', authController.loginUser);

router.get('/me', authMiddleware, authController.getMe);

module.exports = router;