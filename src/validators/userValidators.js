const { body } = require('express-validator');
const { INTERESES_VALIDOS } = require('../models/User');

const actualizarPerfilValidators = [
  body('intereses')
    .optional()
    .isArray()
    .withMessage('Los intereses deben enviarse como un arreglo')
    .custom((valores) => {
      const invalidos = valores.filter((v) => !INTERESES_VALIDOS.includes(v));
      if (invalidos.length > 0) {
        throw new Error(
          `Intereses inválidos: ${invalidos.join(', ')}. Válidos: ${INTERESES_VALIDOS.join(', ')}`
        );
      }
      return true;
    }),

  body('presupuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número mayor o igual a 0'),
];

module.exports = { actualizarPerfilValidators };
