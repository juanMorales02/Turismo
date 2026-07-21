const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

/**
 * Middleware que valida el JWT enviado en el header Authorization.
 * Formato esperado: "Authorization: Bearer <token>"
 * Si es válido, adjunta { id } del usuario en req.usuario.
 */
function protegerRuta(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No se proporcionó un token de autenticación'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Token no encontrado en la petición'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id };
    next();
  } catch (error) {
    // jwt.verify lanza TokenExpiredError o JsonWebTokenError,
    // que ya son manejados por el errorHandler central.
    next(error);
  }
}

module.exports = protegerRuta;
