const { body } = require('express-validator');

// Reglas de contraseña: mínimo 8 caracteres, al menos 1 mayúscula y 1 número
const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('La contraseña debe tener al menos 8 caracteres')
  .matches(/[A-Z]/)
  .withMessage('La contraseña debe contener al menos una letra mayúscula')
  .matches(/[0-9]/)
  .withMessage('La contraseña debe contener al menos un número');

const registrarValidators = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres'),

  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),

  passwordRule,
];

const loginValidators = [
  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = { registrarValidators, loginValidators };
