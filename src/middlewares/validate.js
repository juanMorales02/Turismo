const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware genérico que revisa si express-validator encontró errores
 * en la petición y, de ser así, responde 400 con el detalle por campo.
 * Se usa después de un arreglo de reglas de validación en cada ruta.
 */
function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errores = result.array().map((err) => ({
      campo: err.path,
      mensaje: err.msg,
    }));
    return next(new ApiError(400, 'Error de validación en los datos enviados', errores));
  }

  next();
}

module.exports = validate;
