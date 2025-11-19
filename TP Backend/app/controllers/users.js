const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const User = require('../models/users');
const { generateToken } = require('../utils/jwt');

const createItem = async (req, res) => {
    try {
        
        if (req.body.rol === 'admin') {
            const existingAdmin = await User.findOne({ rol: 'admin' });
            if (existingAdmin) {
                return res.status(403).json({ error: 'An admin user already exists. Cannot create more admins.' });
            }
        }

        
        const user = await User.create(req.body);
        const token = generateToken({ id: user._id, rol: user.rol }); 
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItem = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = generateToken({ id: user._id, rol: user.rol });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, getItems, getItem, createItem, updateItem, deleteItem };