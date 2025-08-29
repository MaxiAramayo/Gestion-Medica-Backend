import express from "express";
import cors from "cors";
import config from "./config";
import errorHandler from "./middlewares/errorHandler.middleware";

// Importa rutas de módulos
import userRoutes from "./modules/users/user.routes";
import personRoutes from "./modules/persons/person.routes";
import medicalAreaRoutes from "./modules/medical-area/medical-area.routes";
import reportTypeRoutes from "./modules/report-type/report-type.routes";
import patientRoutes from "./modules/patient/patient.routes";
import doctorRoutes from "./modules/doctor/doctor.routes";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/v1", userRoutes);
app.use("/api/v1", personRoutes);
app.use("/api/v1", medicalAreaRoutes);
app.use("/api/v1", reportTypeRoutes);
app.use("/api/v1", patientRoutes);
app.use("/api/v1", doctorRoutes);

// Ruta de prueba
app.get("/", (_req, res) => {
  res.send("API funcionando 🚀");
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;