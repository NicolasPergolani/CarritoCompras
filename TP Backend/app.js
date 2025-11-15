require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/mongo');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database connection
dbConnect();

// Routes - orden específico primero
app.use('/permit', require('./app/routes/permit'));
app.use('/product', require('./app/routes/product'));
app.use('/users', require('./app/routes/users'));
app.use('/', require('./app/routes/users')); // Para /login y /register

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;