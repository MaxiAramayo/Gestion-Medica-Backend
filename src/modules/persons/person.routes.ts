import { Router }   from 'express';
import { addPerson,
  getPersons, 
  getPersonById,
  updatePerson,
  deletePerson,
  searchPersons } from './person.controller';


const router = Router();

// IMPORTANTE: Las rutas específicas ANTES que las rutas con parámetros
router.post('/persons', addPerson);           // Crear persona
router.get('/persons', getPersons);           // Obtener todas las personas
router.get('/persons/search', searchPersons); // ✅ DEBE IR ANTES de /:id
router.get('/persons/:id', getPersonById);    // ✅ Después de rutas específicas
router.put('/persons/:id', updatePerson);     // Actualizar persona
router.delete('/persons/:id', deletePerson);  // Eliminar persona

export default router;