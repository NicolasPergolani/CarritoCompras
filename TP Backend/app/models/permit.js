const mongoose = require('mongoose');

const permitSchema = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Permit', permitSchema);