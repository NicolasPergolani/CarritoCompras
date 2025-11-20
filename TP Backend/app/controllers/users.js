const userService = require('../services/user');

const createItem = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes('admin user already exists')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItem = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (error.message.includes('admin user already exists')) {
            return res.status(403).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.authenticateUser(email, password);
        res.status(200).json({ token: result.token });
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, getItems, getItem, createItem, updateItem, deleteItem };