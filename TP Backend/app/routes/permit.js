const express = require('express');
const router = express.Router();
const { getItems, getItem, createPermit, updateItem, deleteItem } = require('../controllers/permit');

// Middleware to validate roles (if needed in the future)
router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', createPermit);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;