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


router.get('/', authenticate, checkAdmin, getOrders); 
router.get('/my-orders', authenticate, getUserOrders); 
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, createOrder); 
router.patch('/:id/add-product', authenticate, addProductToOrder);
router.patch('/:id/remove-product', authenticate, removeProductFromOrder);
router.patch('/:id/status', authenticate, checkAdmin, updateOrderStatus); 

module.exports = router;