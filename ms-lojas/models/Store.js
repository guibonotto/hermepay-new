// models/Store.js

const mongoose = require('mongoose');

// --- 1. NOSSO NOVO SUB-SCHEMA ---
// Define a estrutura dos dados bancários que você pediu
const BankAccountSchema = new mongoose.Schema({
    ownerName: { // Nome do Dono da Conta
        type: String,
        required: true,
        trim: true
    },
    bankName: { // Nome do Banco
        type: String,
        required: true
    },
    agency: { // Agência
        type: String,
        required: true
    },
    accountNumber: { // Conta
        type: String,
        required: true
    },
    accountType: { // Tipo de Conta
        type: String,
        required: true,
        enum: ['corrente', 'poupanca'] // Só permite "corrente" ou "poupanca"
    },
    status: { // Status
        type: String,
        default: 'active' // Já começa como 'active'
    }
}, { 
    timestamps: true // Adiciona createdAt/updatedAt para a conta bancária
});


// --- 2. NOSSO SCHEMA PRINCIPAL (MODIFICADO) ---
const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome da loja é obrigatório.'],
        trim: true 
    },
    api_key: {
        type: String,
        required: true,
        unique: true
    },
    deletedAt: {
        type: Date,
        default: null
    },

    // --- 3. A GRANDE MUDANÇA ---
    // Adicionamos um array que usará a estrutura do BankAccountSchema
    bankAccounts: [BankAccountSchema]

}, {
    timestamps: true
});

// Lógica do Soft Delete
StoreSchema.pre('find', function() {
    this.where({ deletedAt: null });
});
StoreSchema.pre('findOne', function() {
    this.where({ deletedAt: null });
});

module.exports = mongoose.model('Store', StoreSchema);