const mongoose = require('mongoose');

const INTERESES_VALIDOS = ['aventura', 'naturaleza', 'gastronomia', 'cultura'];

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true, // ya crea el índice único, no se declara de nuevo abajo
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false, // nunca se devuelve por defecto en las consultas
    },
    perfilViajero: {
      intereses: {
        type: [String],
        enum: INTERESES_VALIDOS,
        default: [],
      },
      presupuesto: {
        type: Number,
        min: 0,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
module.exports.INTERESES_VALIDOS = INTERESES_VALIDOS;
