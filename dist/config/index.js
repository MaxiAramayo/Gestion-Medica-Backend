"use strict";
// src/config/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Carga las variables de entorno del archivo .env
dotenv_1.default.config();
// Objeto de configuración que exportaremos
const config = {
    port: parseInt(process.env.PORT || '4000', 10), // Puerto del servidor, default 4000
    nodeEnv: process.env.NODE_ENV || 'development', // Entorno de Node, default 'development'
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@host:port/database', // URL de tu base de datos
    jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey', // Clave secreta para JWT, ¡cambia esta en producción!
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d', // Tiempo de expiración del JWT, default 1 día
};
// Validaciones básicas de configuración (opcional pero recomendado)
if (!config.databaseUrl) {
    console.error('ERROR: DATABASE_URL no está definida en las variables de entorno.');
    process.exit(1);
}
// Puedes añadir más validaciones aquí
if (!config.jwtSecret || config.jwtSecret === 'supersecretjwtkey') {
    console.warn('ADVERTENCIA: JWT_SECRET no está definida o usa el valor por defecto. ¡Cambiar en producción!');
}
exports.default = config;
