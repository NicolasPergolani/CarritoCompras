const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        unique: true
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    permit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permit'
    }
});

module.exports = mongoose.model('Users', userSchema);