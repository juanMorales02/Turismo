const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de salud, útil para verificar que el despliegue en Render funciona
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API GuíaSanGil funcionando correctamente 🏞️',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/planes', planRoutes);

// 404 para rutas no definidas
app.use(notFoundHandler);

// Manejo centralizado de errores (siempre al final)
app.use(errorHandler);

module.exports = app;
