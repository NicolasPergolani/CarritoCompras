const mongoose = require('mongoose');

const permitSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        default: 'user' // Default role is 'user'
    }
});

module.exports = mongoose.model('Permit', permitSchema);