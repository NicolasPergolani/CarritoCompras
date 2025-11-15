const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder, addProductToOrder, removeProductFromOrder } = require('../controllers/order');

// Define order routes
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id/add-product', addProductToOrder);
router.patch('/:id/remove-product', removeProductFromOrder);

module.exports = router;