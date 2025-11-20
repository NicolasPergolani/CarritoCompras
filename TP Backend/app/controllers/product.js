const productService = require('../services/product');

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};


const getAvailableProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const availableProducts = products.filter(product => product.stock > 0);
        res.json(availableProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const product = await productService.updateProductStock(req.params.id, stock);
        res.json(product);
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAvailableProducts, updateStock };