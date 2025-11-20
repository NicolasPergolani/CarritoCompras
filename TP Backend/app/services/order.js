const Order = require('../models/order');
const Product = require('../models/product');

class OrderService {
    
    async getAllOrders() {
        return await Order.find()
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category')
            .sort({ createdAt: -1 });
    }

    async getOrderById(orderId, userId, userRole) {
        const order = await Order.findById(orderId)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (userRole !== 'admin' && order.user._id.toString() !== userId) {
            throw new Error('Access denied. You can only view your own orders.');
        }
        
        return order;
    }

    async getUserOrders(userId) {
        return await Order.find({ user: userId })
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category')
            .sort({ createdAt: -1 });
    }

    async createOrder(userId, products) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw new Error('Products are required');
        }

        const enrichedProducts = [];
        const stockUpdates = [];
        
        for (const item of products) {
            if (!item.product || !item.quantity || item.quantity <= 0) {
                throw new Error('Each product must have a valid product ID and quantity greater than 0');
            }

            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }
            
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product "${product.description}". Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            
            enrichedProducts.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });
            
            stockUpdates.push({
                productId: item.product,
                newStock: product.stock - item.quantity
            });
        }

        const order = await Order.create({ 
            user: userId,
            products: enrichedProducts 
        });

        for (const update of stockUpdates) {
            await Product.findByIdAndUpdate(
                update.productId,
                { stock: update.newStock },
                { new: true }
            );
        }

        return await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');
    }

    async updateOrderStatus(orderId, newStatus) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }

        const currentOrder = await Order.findById(orderId).populate('products.product');
        if (!currentOrder) {
            throw new Error('Order not found');
        }
        
        if (newStatus === 'cancelled' && currentOrder.status !== 'cancelled') {
            for (const item of currentOrder.products) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: item.quantity } }, 
                    { new: true }
                );
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true }
        ).populate('user', 'name lastName email')
         .populate('products.product', 'name description category');

        return updatedOrder;
    }

    async addProductToOrder(orderId, productId, quantity, userId, userRole) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        if (userRole !== 'admin' && order.user.toString() !== userId) {
            throw new Error('Access denied. You can only modify your own orders.');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock for product "${product.description}". Available: ${product.stock}, Requested: ${quantity}`);
        }

        order.products.push({ 
            product: productId, 
            quantity,
            price: product.price
        });

        await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

        await order.save();

        return await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');
    }

    async removeProductFromOrder(orderId, productId, userId, userRole) {
        const order = await Order.findById(orderId).populate('products.product');
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (userRole !== 'admin' && order.user.toString() !== userId) {
            throw new Error('Access denied. You can only modify your own orders.');
        }

        const orderProduct = order.products.find(item => item.product._id.toString() === productId);
        if (orderProduct) {
            await Product.findByIdAndUpdate(productId, { $inc: { stock: orderProduct.quantity } });
        }

        order.products = order.products.filter(item => item.product._id.toString() !== productId);
        await order.save();

        return await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');
    }

    async getOrderStats() {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const completedOrders = await Order.countDocuments({ status: 'delivered' });
        
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const avgOrderValue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, avgValue: { $avg: "$totalPrice" } } }
        ]);

        return {
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            averageOrderValue: avgOrderValue[0]?.avgValue || 0
        };
    }

    async getOrdersByStatus(status) {
        return await Order.find({ status })
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category')
            .sort({ createdAt: -1 });
    }
}

module.exports = new OrderService();