/**
 * Error personalizado para poder lanzar errores con código HTTP específico
 * desde cualquier controlador o servicio, y que el middleware central
 * los transforme en una respuesta JSON consistente.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // útil para errores de validación por campo
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
