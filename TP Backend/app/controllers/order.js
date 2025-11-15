const Order = require('../models/order');
const Product = require('../models/product');

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single order by ID
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        // Validate products
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ error: `Product with ID ${item.product} not found` });
            }
        }

        const order = await Order.create({ products });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add a product to an order
const addProductToOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ error: 'Product not found' });

        order.products.push({ product: productId, quantity });
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove a product from an order
const removeProductFromOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.products = order.products.filter(item => item.product.toString() !== productId);
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getOrders, getOrder, createOrder, addProductToOrder, removeProductFromOrder };