const { GoogleGenerativeAI } = require('@google/generative-ai');
const ApiError = require('../utils/ApiError');

let genAI = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new ApiError(500, 'GEMINI_API_KEY no está configurada en el servidor');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Construye el prompt para Gemini incluyendo:
 * - Contexto real de la región (San Gil, Curití, Barichara, Mogotes, río Fonce, río Suárez)
 * - Preferencias guardadas del perfil del viajero
 * - Los datos puntuales de la consulta actual
 */
function construirPrompt({ perfilViajero, consulta }) {
  const intereses =
    perfilViajero?.intereses?.length > 0
      ? perfilViajero.intereses.join(', ')
      : 'sin preferencias específicas registradas';

  const presupuestoPerfil =
    perfilViajero?.presupuesto != null ? `$${perfilViajero.presupuesto} COP aprox.` : 'no especificado';

  return `Eres un guía turístico experto en San Gil, Santander (Colombia) y su región: Curití, Barichara, Mogotes, el río Fonce y el río Suárez. Conoces actividades de aventura (rafting, parapente, espeleología en las cuevas del Indio, canyoning, torrentismo), fincas, balnearios y restaurantes locales.

Perfil del viajero:
- Intereses declarados: ${intereses}
- Presupuesto general aproximado: ${presupuestoPerfil}

Consulta actual del turista:
- Mensaje: "${consulta.mensaje}"
- Tipo de actividad deseada: ${consulta.tipoActividad || 'no especificado'}
- Presupuesto para este plan: ${consulta.presupuesto != null ? `$${consulta.presupuesto} COP` : 'no especificado'}
- Tiempo disponible: ${consulta.tiempoDisponible || 'no especificado'}
- Nivel de adrenalina deseado: ${consulta.nivelAdrenalina || 'no especificado'}

Con esta información, recomienda un plan turístico específico y realista para San Gil y su región. Menciona lugares concretos, una actividad principal, una alternativa, y un tip práctico (costo aproximado, horario o recomendación de seguridad). Responde en español, en un tono cercano, en máximo 200 palabras.`;
}

/**
 * Llama a la API de Gemini con el prompt construido y devuelve el texto
 * de la recomendación generada.
 */
async function generarRecomendacion({ perfilViajero, consulta }) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  });

  const prompt = construirPrompt({ perfilViajero, consulta });

  try {
    const result = await model.generateContent(prompt);
    const texto = result.response.text();

    if (!texto) {
      throw new ApiError(502, 'La IA no devolvió una respuesta válida');
    }

    return texto;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, `Error al consultar el servicio de IA: ${error.message}`);
  }
}

module.exports = { generarRecomendacion, construirPrompt };
