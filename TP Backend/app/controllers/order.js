const orderService = require('../services/order');


const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.rol);
        res.json(order);
    } catch (error) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};



const createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id; 

        const order = await orderService.createOrder(userId, products);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const addProductToOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.rol;

        const order = await orderService.addProductToOrder({ orderId, productId, quantity, userId, userRole });
        res.json(order);
    } catch (error) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};


const removeProductFromOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.rol;

        const order = await orderService.removeProductFromOrder({ orderId, productId, userId, userRole });
        res.json(order);
    } catch (error) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const orders = await orderService.getUserOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await orderService.updateOrderStatus(orderId, status);
        res.json(order);
    } catch (error) {
        if (error.message === 'Order not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Invalid status') {
            return res.status(400).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

module.exports = { 
    getOrders, 
    getOrder, 
    createOrder, 
    addProductToOrder, 
    removeProductFromOrder,
    getUserOrders,
    updateOrderStatus
};