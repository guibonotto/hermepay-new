// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Este é o nosso "segurança" de rotas.
 * Ele verifica se o token JWT enviado no header é válido.
 */
const authMiddleware = (req, res, next) => {
    // 1. Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    // 2. Verifica se o token foi enviado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 3. Extrai o token (remove o "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verifica se o token é válido (usando nosso segredo)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Se for válido, anexa os dados do usuário (o 'payload' do token)
        // à requisição (req) para que a próxima função (o controller) possa usá-los.
        req.user = decoded; // ex: req.user.userId, req.user.storeId

        next(); // Deixa a requisição continuar para o controller

    } catch (error) {
        // Se o token for inválido ou expirado
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;