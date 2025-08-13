// src/app.ts

import express, { Request, Response } from "express";
import config from "./config"; // Importamos la configuración, incluyendo el puerto
const { port: PUERTO } = config; // Obtenemos el puerto desde nuestra
import cors from "cors";
// No importamos dotenv aquí, ya lo hace config/index.ts
import userRoutes from "./modules/users/user.routes"; // Asumiendo que ya tienes la estructura de módulos
import errorHandler from "./middlewares/errorHandler.middleware";
import personRoutes from "./modules/persons/person.routes"; // Importa las rutas del módulo de personas
import medicalArea from "./modules/medical-area/medical-area.routes";
const app = express();

// Middlewares globales
app.use(cors()); // Manejo de CORS
app.use(express.json()); // Permite a Express parsear cuerpos de solicitud JSON
app.use(express.urlencoded({ extended: true })); // Permite a Express parsear cuerpos de solicitud URL-encoded

// Rutas de la API
// Preferiblemente, deberías importar todas tus rutas aquí
// Ejemplo:
// import authRoutes from './modules/auth/auth.routes';
// import patientRoutes from './modules/patients/patient.routes';
// ...etc.

app.use("/api/v1", userRoutes); // Ruta base para el módulo de usuarios
// Puedes agregar más rutas de módulos aquí


app.use("/api/v1", personRoutes); // Ejemplo para módulo de personas
app.use("/api/v1", medicalArea)
// app.use("/api/auth", authRoutes); // Ejemplo para módulo de autenticación
// app.use("/api/patients", patientRoutes); // Ejemplo para módulo de pacientes

// Ruta de prueba
app.get("/", (_req: Request, res: Response) => {
  res.send(`API funcionando 🚀`);
});

// Importar y usar el middleware de manejo de errores al final (opcional, pero buena práctica)
// import errorHandler from './middlewares/errorHandler.middleware';
// app.use(errorHandler);

// <--- MUY IMPORTANTE: El middleware de errores SIEMPRE debe ir AL FINAL
app.use(errorHandler);

// Exportamos la aplicación Express para que server.ts la pueda importar y escuchar
export default app;
