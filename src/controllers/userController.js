const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/usuarios/perfil
const obtenerPerfil = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.usuario.id);
  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  res.json({
    ok: true,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      perfilViajero: usuario.perfilViajero,
    },
  });
});

// PUT /api/usuarios/perfil
// Permite actualizar intereses y presupuesto, que luego se inyectan
// automáticamente en el prompt de la IA.
const actualizarPerfil = asyncHandler(async (req, res) => {
  const { intereses, presupuesto } = req.body;

  const usuario = await User.findById(req.usuario.id);
  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  if (intereses !== undefined) {
    usuario.perfilViajero.intereses = intereses;
  }
  if (presupuesto !== undefined) {
    usuario.perfilViajero.presupuesto = presupuesto;
  }

  await usuario.save();

  res.json({
    ok: true,
    mensaje: 'Perfil de viajero actualizado correctamente',
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      perfilViajero: usuario.perfilViajero,
    },
  });
});

module.exports = { obtenerPerfil, actualizarPerfil };
