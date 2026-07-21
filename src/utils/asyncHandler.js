/**
 * Envuelve controladores async para capturar cualquier error (rechazo de
 * promesa) y pasarlo a next(), evitando que un error asíncrono tumbe el
 * servidor o quede sin manejar.
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
