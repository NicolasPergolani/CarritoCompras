require('dotenv').config();
const express = require('express');
const app = express();
const dbConnect = require('./config/mongo'); 

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/users', require('./app/routes/users'));
app.use('/permit', require('./app/routes/permit'));
dbConnect();

app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`);
});

module.exports = { dbConnect, app };