require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dbConnect = require('./config/mongo'); 

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const PORT = process.env.PORT || 3000;

app.use('/', require('./app/routes/users'));
app.use('/permit', require('./app/routes/permit'));
dbConnect();

app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`);
});

module.exports = { dbConnect, app };