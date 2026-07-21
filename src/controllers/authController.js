const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

function generarToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// POST /api/auth/registro
const registrar = asyncHandler(async (req, res) => {
  const { nombre, correo, password } = req.body;

  const existente = await User.findOne({ correo });
  if (existente) {
    throw new ApiError(409, 'Ya existe una cuenta registrada con ese correo');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  const nuevoUsuario = await User.create({
    nombre,
    correo,
    password: passwordHasheada,
  });

  const token = generarToken(nuevoUsuario._id);

  res.status(201).json({
    ok: true,
    mensaje: 'Usuario registrado correctamente',
    token,
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { correo, password } = req.body;

  // select('+password') porque el schema lo excluye por defecto
  const usuario = await User.findOne({ correo }).select('+password');

  if (!usuario) {
    throw new ApiError(401, 'Correo o contraseña incorrectos');
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    throw new ApiError(401, 'Correo o contraseña incorrectos');
  }

  const token = generarToken(usuario._id);

  res.json({
    ok: true,
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
  });
});

module.exports = { registrar, login };
