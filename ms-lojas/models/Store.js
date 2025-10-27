// models/Store.js

const mongoose = require('mongoose');

// 1. Definição do Schema (a "forma" dos nossos dados)
const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome da loja é obrigatório.'], // Equivalente à validação 'required'
        trim: true // Remove espaços em branco do início e fim
    },
    api_key: {
        type: String,
        required: true,
        unique: true // Garante que a chave de API seja única no banco
    },
    // Implementação do Soft Delete (equivalente ao SoftDeletes do Laravel)
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    // Adiciona automaticamente os campos `createdAt` e `updatedAt` (igual ao timestamps() do Laravel)
    timestamps: true
});

// 2. Lógica do Soft Delete (para todas as buscas)
// Isso garante que qualquer comando 'find' ignore os documentos "deletados"
StoreSchema.pre('find', function() {
    this.where({ deletedAt: null });
});
StoreSchema.pre('findOne', function() {
    this.where({ deletedAt: null });
});

// 3. Criar e exportar o Model
// O Mongoose pegará o nome 'Store' e o transformará no nome da coleção 'stores' no MongoDB
module.exports = mongoose.model('Store', StoreSchema);