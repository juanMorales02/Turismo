const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    consulta: {
      tipoActividad: { type: String, trim: true },
      presupuesto: { type: Number, min: 0 },
      tiempoDisponible: { type: String, trim: true },
      nivelAdrenalina: { type: String, trim: true },
      mensaje: { type: String, trim: true }, // texto libre del turista, ej: "quiero algo de adrenalina y tengo medio día"
    },
    respuestaIA: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt sirve como "fecha" de la recomendación
);

module.exports = mongoose.model('Plan', planSchema);
