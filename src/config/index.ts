// src/config/index.ts

import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env
dotenv.config();

// Define una interfaz para asegurar que las variables de entorno estén presentes y tipadas
interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string; // Ejemplo, si tienes una variable para la URL de la DB
  jwtSecret: string; // Ejemplo, para tu clave secreta de JWT
  jwtExpiresIn: string; // Opcional, si tienes una variable para la expiración del JWT
  // Agrega más variables de entorno aquí según las necesites
}

// Objeto de configuración que exportaremos
const config: Config = {
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


export default config;