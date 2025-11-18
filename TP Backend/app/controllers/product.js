const Product = require('../models/product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products with available stock
const getAvailableProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product stock
const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock < 0) {
            return res.status(400).json({ error: 'Stock cannot be negative' });
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock: stock },
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAvailableProducts, updateStock };