const { body, param } = require('express-validator');

const crearPlanValidators = [
  body('mensaje')
    .trim()
    .notEmpty()
    .withMessage('Debes describir qué tipo de plan buscas, ej: "algo de adrenalina y medio día libre"')
    .isLength({ max: 500 })
    .withMessage('El mensaje no puede superar los 500 caracteres'),

  body('tipoActividad').optional().trim().isLength({ max: 60 }),

  body('presupuesto')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número mayor o igual a 0'),

  body('tiempoDisponible').optional().trim().isLength({ max: 60 }),

  body('nivelAdrenalina')
    .optional()
    .trim()
    .isIn(['bajo', 'medio', 'alto'])
    .withMessage('El nivel de adrenalina debe ser: bajo, medio o alto'),
];

const idPlanValidators = [param('id').isMongoId().withMessage('El id del plan no es válido')];

module.exports = { crearPlanValidators, idPlanValidators };
