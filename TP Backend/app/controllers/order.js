const Order = require('../models/order');
const Product = require('../models/product');


const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
      
        if (req.user.rol !== 'admin' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. You can only view your own orders.' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id; 

       
        const enrichedProducts = [];
        const stockUpdates = [];
        
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ error: `Product with ID ${item.product} not found` });
            }
            
           
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for product "${product.description}". Available: ${product.stock}, Requested: ${item.quantity}` 
                });
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

       
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const addProductToOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        
        if (req.user.rol !== 'admin' && order.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. You can only modify your own orders.' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ error: 'Product not found' });

        order.products.push({ 
            product: productId, 
            quantity,
            price: product.price
        });
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');

        res.json(populatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const removeProductFromOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });
        
       
        if (req.user.rol !== 'admin' && order.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. You can only modify your own orders.' });
        }

        order.products = order.products.filter(item => item.product.toString() !== productId);
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category');

        res.json(populatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('user', 'name lastName email')
            .populate('products.product', 'name description category')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        
        const currentOrder = await Order.findById(req.params.id).populate('products.product');
        if (!currentOrder) return res.status(404).json({ error: 'Order not found' });
        
        
        if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
            for (const item of currentOrder.products) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: item.quantity } }, 
                    { new: true }
                );
            }
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name lastName email')
         .populate('products.product', 'name description category');

        res.json(order);
    } catch (error) {
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