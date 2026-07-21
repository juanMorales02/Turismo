const express = require('express');
const router = express.Router();

const { obtenerPerfil, actualizarPerfil } = require('../controllers/userController');
const protegerRuta = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { actualizarPerfilValidators } = require('../validators/userValidators');

// Todas las rutas de este archivo requieren autenticación
router.use(protegerRuta);

// GET /api/usuarios/perfil
router.get('/perfil', obtenerPerfil);

// PUT /api/usuarios/perfil
router.put('/perfil', actualizarPerfilValidators, validate, actualizarPerfil);

module.exports = router;
