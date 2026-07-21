require('dotenv').config();
const mongoose = require('mongoose');

async function probar() {
  console.log('Intentando conectar a MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexion exitosa a MongoDB Atlas');
    console.log('Base de datos activa:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('Error al conectar:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

probar();
