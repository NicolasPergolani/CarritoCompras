const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const { 
    getOrders, 
    getOrder, 
    createOrder, 
    addProductToOrder, 
    removeProductFromOrder,
    getUserOrders,
    updateOrderStatus
} = require('../controllers/order');

// Define order routes
router.get('/', authenticate, checkAdmin, getOrders); // Solo admin puede ver todas las órdenes
router.get('/my-orders', authenticate, getUserOrders); // Usuario ve sus órdenes
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, createOrder); // Requiere autenticación para crear orden
router.patch('/:id/add-product', authenticate, addProductToOrder);
router.patch('/:id/remove-product', authenticate, removeProductFromOrder);
router.patch('/:id/status', authenticate, checkAdmin, updateOrderStatus); // Solo admin puede cambiar estado

module.exports = router;