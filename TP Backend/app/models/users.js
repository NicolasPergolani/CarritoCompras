const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    password: {
        type: String,
        required: true
    }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Users', userSchema);