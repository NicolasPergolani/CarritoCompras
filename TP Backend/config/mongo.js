const mongoose = require('mongoose');

const dbConnect = async () => {
    const DB_URI = process.env.MONGO_URI;
    
    if (!DB_URI) {
        console.error('❌ MONGO_URI no está definida en las variables de entorno');
        console.error('💡 Asegúrate de que tu archivo .env tenga: MONGO_URI=mongodb+srv://...');
        process.exit(1);
    }
    
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ Conectado a BD:', DB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local');
    } catch (error) {
        console.error('❌ Error conectando a BD:', error.message);
        console.error('🔍 Verifica tu connection string y credenciales');
        process.exit(1);
    }
};

module.exports = dbConnect;