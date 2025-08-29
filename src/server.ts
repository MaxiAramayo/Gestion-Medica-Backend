import app from './app';
import config from './config';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api/v1`);
});

// Manejo de errores para promesas no manejadas
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message, err.stack);
  server.close(() => process.exit(1));
});