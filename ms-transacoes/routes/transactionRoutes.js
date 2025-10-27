// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// READ ALL
router.get('/', transactionController.getAllTransactions);

// READ ONE
router.get('/:id', transactionController.getTransactionById);

// DELETE (Soft Delete)
router.delete('/:id', transactionController.deleteTransaction);

// Nota: Não temos 'POST' ou 'PUT' aqui, pois o POST é feito pela Function
// e o PUT não foi pedido no escopo.

module.exports = router;