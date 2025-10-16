const Permit = require('../models/permit');


const getItems = async (req, res) => {
    try {
        const permits = await Permit.find();
        res.json(permits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getItem = async (req, res) => {
    try {
        const permit = await Permit.findById(req.params.id);
        if (!permit) return res.status(404).json({ error: "Permiso no encontrado" });
        res.json(permit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createItem = async (req, res) => {
    try {
        const permit = await Permit.create(req.body);
        res.status(201).json(permit);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'El nombre ya existe' });
        }
        res.status(400).json({ error: err.message });
    }
};


const updateItem = async (req, res) => {
    try {
        const permit = await Permit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!permit) return res.status(404).json({ error: 'Permiso no encontrado' });
        res.json(permit);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'El nombre ya existe' });
        }
        res.status(400).json({ error: err.message });
    }
};


const deleteItem = async (req, res) => {
    try {
        const permit = await Permit.findByIdAndDelete(req.params.id);
        if (!permit) return res.status(404).json({ error: 'Permiso no encontrado' });
        res.json({ message: "Permiso eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { getItems, getItem, createItem, updateItem, deleteItem };