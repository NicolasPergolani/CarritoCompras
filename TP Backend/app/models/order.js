const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total price before saving
orderSchema.pre('save', async function (next) {
    try {
        this.totalPrice = this.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Order', orderSchema);