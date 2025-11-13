// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// --- ROTAS GERAIS (sem /:id) ---
// (Estas podem vir primeiro)
router.post('/', storeController.createStore);
router.get('/', storeController.getAllStores);

// --- ROTAS ESPECÍFICAS (com /accounts) ---
// *DEVEM vir antes das rotas '/:id' genéricas*
router.get('/:id/accounts', storeController.getBankAccounts);
router.post('/:id/accounts', storeController.addBankAccount);

// --- NOSSA NOVA ROTA DELETE ---
// :id é o storeId, :accountId é o ID da conta a ser deletada
router.delete('/:id/accounts/:accountId', storeController.deleteBankAccount);

// --- NOVAS ROTAS DE WEBHOOKS ---
router.get('/:id/webhooks', storeController.getWebhooks);
router.post('/:id/webhooks', storeController.addWebhook);

// --- ROTAS GENÉRICAS DE LOJA (com /:id) ---
// *DEVEM vir por último*
router.get('/:id', storeController.getStoreById);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;