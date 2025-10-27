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

// ---------------------------

module.exports = router;