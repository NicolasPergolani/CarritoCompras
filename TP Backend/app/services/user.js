const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { generateToken } = require('../utils/jwt');

class UserService {
    
    async createUser(userData) {
        if (userData.rol === 'admin') {
            const existingAdmin = await User.findOne({ rol: 'admin' });
            if (existingAdmin) {
                throw new Error('An admin user already exists. Cannot create more admins.');
            }
        }

        const user = await User.create(userData);
        const token = generateToken({ id: user._id, rol: user.rol });
        
        return { user, token };
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(userId, updateData) {
        if (updateData.rol === 'admin') {
            const existingAdmin = await User.findOne({ rol: 'admin', _id: { $ne: userId } });
            if (existingAdmin) {
                throw new Error('An admin user already exists. Cannot create more admins.');
            }
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken({ id: user._id, rol: user.rol });
        
        return { user, token };
    }

    async userExistsByEmail(email) {
        const user = await User.findOne({ email });
        return !!user;
    }

    async getUserStats() {
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ rol: 'admin' });
        const regularUserCount = await User.countDocuments({ rol: 'user' });
        
        return {
            totalUsers,
            adminCount,
            regularUserCount
        };
    }
}

module.exports = new UserService();