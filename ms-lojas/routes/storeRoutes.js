// routes/storeRoutes.js

const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// CREATE
router.post('/', storeController.createStore);

// READ ALL
router.get('/', storeController.getAllStores);

// --- NOSSAS NOVAS ROTAS ---

// READ ONE
// :id é um parâmetro de URL (equivalente ao {store} do Laravel)
router.get('/:id', storeController.getStoreById);

// UPDATE
router.put('/:id', storeController.updateStore);

// DELETE
router.delete('/:id', storeController.deleteStore);

// GET /api/stores/:id/accounts (Lista contas de uma loja)
router.get('/:id/accounts', storeController.getBankAccounts);

// POST /api/stores/:id/accounts (Adiciona conta a uma loja)
router.post('/:id/accounts', storeController.addBankAccount);

// --- ROTAS ANTIGAS ---
// READ ONE
router.get('/:id', storeController.getStoreById);
// ... (o resto das rotas PUT e DELETE)

module.exports = router;

module.exports = router;