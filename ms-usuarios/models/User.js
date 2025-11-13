// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importamos o bcrypt para criptografar

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true, // Garante que não existam dois usuários com o mesmo e-mail
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        select: false // IMPORTANTE: Não inclui a senha em buscas (find) por padrão
    },
    // O 'link' para a loja que este usuário gerencia
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store', // Refere-se ao Model 'Store' (da outra coleção)
        required: false // 'false' por enquanto, pois o usuário se cadastra antes
    },
}, {
    timestamps: true // Adiciona createdAt e updatedAt
});

// --- MÁGICA DE CRIPTOGRAFIA (HOOK DO MONGOOSE) ---

// Este 'hook' (gancho) roda AUTOMATICAMENTE antes de um 'save'
UserSchema.pre('save', async function (next) {
    // 'this' se refere ao documento do usuário que está sendo salvo

    // Só criptografa a senha se ela foi modificada (ou é nova)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Gera o "sal" (salt) - uma camada extra de segurança aleatória
        const salt = await bcrypt.genSalt(10); // 10 é o custo (padrão)
        
        // Criptografa a senha do usuário (ex: '123456') com o sal
        this.password = await bcrypt.hash(this.password, salt);
        
        // Continua o processo de salvar
        return next();
    } catch (error) {
        return next(error);
    }
});

// --- MÉTODO PARA COMPARAR SENHAS ---
// Adicionamos um método ao Model para comparar a senha enviada no login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // 'this.password' é a senha criptografada que está no banco
    // 'candidatePassword' é a senha que o usuário digitou (ex: '123456')
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);