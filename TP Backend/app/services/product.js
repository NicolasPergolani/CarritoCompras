const Product = require('../models/product');

class ProductService {
    
    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(productId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData) {
        if (!productData.description || !productData.price || productData.stock === undefined) {
            throw new Error('Description, price, and stock are required');
        }

        if (productData.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        if (productData.stock < 0) {
            throw new Error('Stock cannot be negative');
        }

        return await Product.create(productData);
    }

    async updateProduct(productId, updateData) {
        if (updateData.price !== undefined && updateData.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        if (updateData.stock !== undefined && updateData.stock < 0) {
            throw new Error('Stock cannot be negative');
        }

        const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async updateProductStock(productId, newStock) {
        if (newStock < 0) {
            throw new Error('Stock cannot be negative');
        }

        const product = await Product.findByIdAndUpdate(
            productId, 
            { stock: newStock }, 
            { new: true }
        );

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async deleteProduct(productId) {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async hassufficientStock(productId, requiredQuantity) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product.stock >= requiredQuantity;
    }

    async reduceStock(productId, quantity) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock for product "${product.description}". Available: ${product.stock}, Requested: ${quantity}`);
        }

        product.stock -= quantity;
        return await product.save();
    }

    async increaseStock(productId, quantity) {
        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true }
        );

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async getLowStockProducts(threshold = 10) {
        return await Product.find({ stock: { $lt: threshold } });
    }

    async getProductStats() {
        const totalProducts = await Product.countDocuments();
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });
        const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lt: 10 } });
        
        const avgPrice = await Product.aggregate([
            { $group: { _id: null, avgPrice: { $avg: "$price" } } }
        ]);

        return {
            totalProducts,
            outOfStockProducts,
            lowStockProducts,
            averagePrice: avgPrice[0]?.avgPrice || 0
        };
    }
}

module.exports = new ProductService();