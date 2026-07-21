const express = require('express');
const router = express.Router();

const { crearPlan, listarPlanes, eliminarPlan } = require('../controllers/planController');
const protegerRuta = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { crearPlanValidators, idPlanValidators } = require('../validators/planValidators');

// Todas las rutas de planes requieren autenticación
router.use(protegerRuta);

// POST /api/planes -> genera recomendación con IA y la guarda
router.post('/', crearPlanValidators, validate, crearPlan);

// GET /api/planes -> historial del usuario autenticado
router.get('/', listarPlanes);

// DELETE /api/planes/:id -> elimina un plan propio
router.delete('/:id', idPlanValidators, validate, eliminarPlan);

module.exports = router;
