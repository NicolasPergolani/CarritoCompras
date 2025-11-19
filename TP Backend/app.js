require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/mongo');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


dbConnect();


app.use('/order', require('./app/routes/order'));
app.use('/product', require('./app/routes/product'));
app.use('/users', require('./app/routes/users'));
app.use('/', require('./app/routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;