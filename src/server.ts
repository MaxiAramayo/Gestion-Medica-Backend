import app from './app'; // Importamos la aplicación Express configurada desde app.ts
import config from './config'; // Importamos las configuraciones, incluyendo el puerto

const PORT = config.port; // Obtenemos el puerto desde nuestra configuración

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`); // Un mensaje útil
});

// Opcional: Manejo de errores para promesas no manejadas (unhandled promise rejections)
// Es una buena práctica para atrapar errores que no fueron capturados por try/catch
// o por tu middleware de errores.
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message, err.stack);
  // Cierra el servidor y luego sale del proceso con un código de error
  server.close(() => {
    process.exit(1);
  });
});