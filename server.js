require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 GuíaSanGil API corriendo en http://localhost:${PORT}`);
  });
}

// Manejo de errores no capturados para que la app no se caiga silenciosamente
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

iniciar();
