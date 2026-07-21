const express = require('express');
const router = express.Router();

const { registrar, login } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registrarValidators, loginValidators } = require('../validators/authValidators');

// POST /api/auth/registro
router.post('/registro', registrarValidators, validate, registrar);

// POST /api/auth/login
router.post('/login', loginValidators, validate, login);

module.exports = router;
