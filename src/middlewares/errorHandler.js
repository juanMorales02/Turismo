const ApiError = require('../utils/ApiError');

/**
 * Middleware de manejo centralizado de errores.
 * Debe registrarse SIEMPRE al final, después de todas las rutas.
 * Convierte cualquier error (propio o de librerías como Mongoose) en
 * una respuesta JSON consistente.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let errors = err.errors || null;

  // Errores de validación de Mongoose (ej. required, minlength)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({
      campo: e.path,
      mensaje: e.message,
    }));
    message = 'Error de validación';
  }

  // Error de clave duplicada (ej. correo ya registrado)
  if (err.code === 11000) {
    statusCode = 409;
    const campo = Object.keys(err.keyValue || {})[0] || 'campo';
    message = `El valor de "${campo}" ya está en uso`;
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    ok: false,
    mensaje: message,
    errores: errors,
  });
}

// Middleware para rutas no encontradas (404)
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
