const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAvailableProducts, updateStock } = require('../controllers/product');
const authenticate = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', authenticate, getProducts);
router.get('/available', authenticate, getAvailableProducts); 
router.get('/:id', authenticate, getProduct);
router.post('/', authenticate, checkAdmin, createProduct);
router.patch('/:id', authenticate, checkAdmin, updateProduct);
router.patch('/:id/stock', authenticate, checkAdmin, updateStock);
router.delete('/:id', authenticate, checkAdmin, deleteProduct);

module.exports = router;