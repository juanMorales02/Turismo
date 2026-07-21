# GuíaSanGil API 🏞️

API REST turística con autenticación e IA, construida para practicar un flujo completo de
backend: validación, hashing de contraseñas, JWT, persistencia en MongoDB y consumo de la
API de Gemini para generar recomendaciones de turismo en San Gil, Santander (Colombia) y su
región (Curití, Barichara, Mogotes, río Fonce, río Suárez).

## Stack

- Node.js + Express
- MongoDB + Mongoose
- express-validator
- bcryptjs
- jsonwebtoken (JWT)
- Google Gemini API (`@google/generative-ai`)
- dotenv

## Estructura del proyecto

```
guiasangil/
├── server.js                  # Punto de entrada
├── src/
│   ├── app.js                 # Configuración de Express y montaje de rutas
│   ├── config/db.js           # Conexión a MongoDB
│   ├── models/                # User, Plan
│   ├── middlewares/            # auth (JWT), validate, errorHandler
│   ├── controllers/            # Lógica de negocio
│   ├── routes/                 # Definición de endpoints
│   ├── services/geminiService.js  # Prompt + llamada a Gemini
│   ├── validators/              # Reglas de express-validator
│   └── utils/                  # ApiError, asyncHandler
├── .env.example
└── package.json
```

## Instalación local

1. Clona el repositorio e instala dependencias:

   ```bash
   git clone <URL_DE_TU_REPO>
   cd guiasangil
   npm install
   ```

2. Copia `.env.example` a `.env` y completa tus valores reales:

   ```bash
   cp .env.example .env
   ```

3. Levanta el servidor:

   ```bash
   npm start
   # o en modo desarrollo (reinicia al detectar cambios):
   npm run dev
   ```

4. La API quedará disponible en `http://localhost:3000`.

## Variables de entorno

| Variable          | Descripción                                                      |
|-------------------|-------------------------------------------------------------------|
| `PORT`            | Puerto del servidor (por defecto 3000)                             |
| `MONGODB_URI`     | Cadena de conexión a MongoDB (Atlas o local)                       |
| `JWT_SECRET`      | Clave secreta para firmar los JWT                                  |
| `JWT_EXPIRES_IN`  | Expiración del token, ej: `1d`, `12h`                              |
| `GEMINI_API_KEY`  | API key de Google Gemini ([aistudio.google.com](https://aistudio.google.com/app/apikey)) |
| `GEMINI_MODEL`    | Modelo a usar, ej: `gemini-1.5-flash`                              |
| `NODE_ENV`        | `development` o `production`                                       |

**Nunca subas tu archivo `.env` real al repositorio.** Solo `.env.example` debe estar versionado.

## Endpoints disponibles

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### Autenticación — `/api/auth`

| Método | Ruta         | Protegida | Descripción                                  |
|--------|--------------|-----------|-----------------------------------------------|
| POST   | `/registro`  | No        | Registra un turista (nombre, correo, password) |
| POST   | `/login`     | No        | Autentica y devuelve un JWT                    |

**Body registro:**
```json
{ "nombre": "Ana Gómez", "correo": "ana@mail.com", "password": "Segura123" }
```

**Body login:**
```json
{ "correo": "ana@mail.com", "password": "Segura123" }
```

### Usuario — `/api/usuarios` (todas protegidas)

| Método | Ruta       | Descripción                                          |
|--------|------------|--------------------------------------------------------|
| GET    | `/perfil`  | Devuelve datos del usuario y su perfil de viajero       |
| PUT    | `/perfil`  | Actualiza intereses y presupuesto del perfil de viajero |

**Body PUT `/perfil`:**
```json
{ "intereses": ["aventura", "gastronomia"], "presupuesto": 150000 }
```
Intereses válidos: `aventura`, `naturaleza`, `gastronomia`, `cultura`.

### Planes turísticos (IA) — `/api/planes` (todas protegidas)

| Método | Ruta   | Descripción                                                        |
|--------|--------|-----------------------------------------------------------------------|
| POST   | `/`    | Envía una consulta a Gemini y guarda la recomendación en el historial |
| GET    | `/`    | Lista el historial de planes del usuario autenticado                  |
| DELETE | `/:id` | Elimina un plan propio del historial                                  |

**Body POST `/`:**
```json
{
  "mensaje": "quiero algo de adrenalina y tengo medio día",
  "tipoActividad": "aventura",
  "presupuesto": 100000,
  "tiempoDisponible": "medio día",
  "nivelAdrenalina": "alto"
}
```

El prompt enviado a Gemini incluye automáticamente el contexto regional (San Gil, Curití,
Barichara, Mogotes, río Fonce, río Suárez) y las preferencias guardadas en el perfil del
viajero, para que la recomendación sea específica y no genérica.

## Códigos de error comunes

| Código | Significado                                              |
|--------|-------------------------------------------------------------|
| 400    | Error de validación en los datos enviados                    |
| 401    | Token faltante, inválido o expirado / credenciales incorrectas |
| 403    | El recurso no pertenece al usuario autenticado                |
| 404    | Recurso no encontrado                                          |
| 409    | Conflicto (ej. correo ya registrado)                           |
| 500    | Error interno del servidor                                     |
| 502    | Error al consultar el servicio de IA (Gemini)                  |

## Despliegue en Render

1. Sube el repositorio a GitHub (sin el archivo `.env`).
2. En [Render](https://render.com), crea un nuevo **Web Service** apuntando a tu repo.
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Agrega las variables de entorno de la tabla de arriba en la sección *Environment* de Render.
5. Despliega. El plan gratuito de Render duerme la instancia tras inactividad — es normal.

## Pruebas

Se recomienda probar todos los endpoints con Postman o Thunder Client:
1. Registrar usuario → guardar el `token` devuelto.
2. Login (opcional, ya tienes token del registro).
3. Actualizar perfil de viajero.
4. Crear un plan (usando el token en `Authorization: Bearer <token>`).
5. Listar historial de planes.
6. Eliminar un plan y confirmar que ya no aparece en el listado.
