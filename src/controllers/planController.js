const Plan = require('../models/Plan');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { generarRecomendacion } = require('../services/geminiService');

// POST /api/planes
// Envía la consulta a Gemini (incluyendo el perfil del viajero en el prompt)
// y guarda el resultado como historial asociado al usuario autenticado.
const crearPlan = asyncHandler(async (req, res) => {
  const { mensaje, tipoActividad, presupuesto, tiempoDisponible, nivelAdrenalina } = req.body;

  const usuario = await User.findById(req.usuario.id);
  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  const consulta = { mensaje, tipoActividad, presupuesto, tiempoDisponible, nivelAdrenalina };

  const respuestaIA = await generarRecomendacion({
    perfilViajero: usuario.perfilViajero,
    consulta,
  });

  const nuevoPlan = await Plan.create({
    usuario: usuario._id,
    consulta,
    respuestaIA,
  });

  res.status(201).json({
    ok: true,
    mensaje: 'Recomendación generada y guardada correctamente',
    plan: nuevoPlan,
  });
});

// GET /api/planes
// Lista únicamente el historial del usuario autenticado.
const listarPlanes = asyncHandler(async (req, res) => {
  const planes = await Plan.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });

  res.json({
    ok: true,
    total: planes.length,
    planes,
  });
});

// DELETE /api/planes/:id
// Verifica que el plan pertenezca al usuario autenticado antes de borrarlo.
const eliminarPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Plan no encontrado');
  }

  if (plan.usuario.toString() !== req.usuario.id) {
    throw new ApiError(403, 'No tienes permiso para eliminar este plan');
  }

  await plan.deleteOne();

  res.json({
    ok: true,
    mensaje: 'Plan eliminado correctamente',
  });
});

module.exports = { crearPlan, listarPlanes, eliminarPlan };
