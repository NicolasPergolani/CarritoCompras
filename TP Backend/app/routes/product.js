const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product');
const checkAdmin = require('../middleware/checkAdmin');
const bcrypt = require('bcryptjs');

// Define product routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', checkAdmin, createProduct); // Admin only
router.patch('/:id', checkAdmin, updateProduct); // Admin only
router.delete('/:id', checkAdmin, deleteProduct); // Admin only

module.exports = router;