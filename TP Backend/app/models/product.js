const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Stock must be a non-negative number'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);