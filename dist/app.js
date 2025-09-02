"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config")); // Importamos la configuración, incluyendo el puerto
const { port: PUERTO } = config_1.default; // Obtenemos el puerto desde nuestra
const cors_1 = __importDefault(require("cors"));
// No importamos dotenv aquí, ya lo hace config/index.ts
const user_routes_1 = __importDefault(require("./modules/users/user.routes")); // Asumiendo que ya tienes la estructura de módulos
const errorHandler_middleware_1 = __importDefault(require("./middlewares/errorHandler.middleware"));
const person_routes_1 = __importDefault(require("./modules/persons/person.routes")); // Importa las rutas del módulo de personas
const medical_area_routes_1 = __importDefault(require("./modules/medical-area/medical-area.routes"));
const report_type_routes_1 = __importDefault(require("./modules/report-type/report-type.routes")); // Importa las rutas del módulo de tipos de reporte
const app = (0, express_1.default)();
// Middlewares globales
app.use((0, cors_1.default)()); // Manejo de CORS
app.use(express_1.default.json()); // Permite a Express parsear cuerpos de solicitud JSON
app.use(express_1.default.urlencoded({ extended: true })); // Permite a Express parsear cuerpos de solicitud URL-encoded
// Rutas de la API
// Preferiblemente, deberías importar todas tus rutas aquí
// Ejemplo:
// import authRoutes from './modules/auth/auth.routes';
// import patientRoutes from './modules/patients/patient.routes';
// ...etc.
app.use("/api/v1", user_routes_1.default); // Ruta base para el módulo de usuarios
// Puedes agregar más rutas de módulos aquí
app.use("/api/v1", person_routes_1.default); // Ejemplo para módulo de personas
app.use("/api/v1", medical_area_routes_1.default);
app.use("/api/v1", report_type_routes_1.default); // Ejemplo para módulo de tipos de reporte
// app.use("/api/auth", authRoutes); // Ejemplo para módulo de autenticación
// app.use("/api/patients", patientRoutes); // Ejemplo para módulo de pacientes
// Ruta de prueba
app.get("/", (_req, res) => {
    res.send(`API funcionando 🚀`);
});
// Importar y usar el middleware de manejo de errores al final (opcional, pero buena práctica)
// import errorHandler from './middlewares/errorHandler.middleware';
// app.use(errorHandler);
// <--- MUY IMPORTANTE: El middleware de errores SIEMPRE debe ir AL FINAL
app.use(errorHandler_middleware_1.default);
// Exportamos la aplicación Express para que server.ts la pueda importar y escuchar
exports.default = app;
