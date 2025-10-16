const mongoose = require('mongoose');

const dbConnect = async () => {
    const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
    try {
        await mongoose.connect(DB_URI);
        console.log('Conectado a BD');
    } catch (error) {
        console.error('Error conectando a BD:', error);
        process.exit(1);
    }
};

module.exports = dbConnect;