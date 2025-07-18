import { Request, Response } from 'express';
import * as personService from './person.service';
import { 
  createPersonSchema, 
  updatePersonSchema, 
  idParamSchema, 
  searchQuerySchema 
} from './person.validation';
import AppError from '../../utils/appError';

/**
 * Controlador para crear una nueva persona
 * @param req - Request con los datos de la persona en el body
 * @param res - Response con la persona creada
 */
export const addPerson = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar datos del body
    const validatedData = createPersonSchema.parse(req.body);
    
    const person = await personService.addPerson(validatedData);
    res.status(201).json({
      success: true,
      message: 'Persona creada exitosamente',
      data: person
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ 
        success: false,
        message: 'Datos de entrada inválidos',
        errors: err.errors 
      });
      return;
    }
    
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Controlador para obtener todas las personas
 * @param _req - Request (no se usa)
 * @param res - Response con el array de personas
 */
export const getPersons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const persons = await personService.getAllPersons();
    res.status(200).json({
      success: true,
      message: 'Personas obtenidas exitosamente',
      data: persons,
      count: persons.length
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Controlador para obtener una persona por ID
 * @param req - Request con el ID en los parámetros
 * @param res - Response con la persona encontrada
 */
export const getPersonById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar parámetro ID
    const { id } = idParamSchema.parse(req.params);
    
    const person = await personService.getPersonById(Number(id));
    if (!person) {
      res.status(404).json({ 
        success: false,
        message: 'Persona no encontrada' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Persona obtenida exitosamente',
      data: person
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ 
        success: false,
        message: 'ID de persona inválido',
        errors: err.errors 
      });
      return;
    }
    
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Controlador para actualizar una persona
 * @param req - Request con el ID en parámetros y datos en el body
 * @param res - Response con la persona actualizada
 */
export const updatePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar parámetro ID
    const { id } = idParamSchema.parse(req.params);
    
    // Validar datos del body
    const validatedData = updatePersonSchema.parse(req.body);
    
    const updatedPerson = await personService.updatePerson(
      Number(id),
      validatedData
    );
    
    res.status(200).json({
      success: true,
      message: 'Persona actualizada exitosamente',
      data: updatedPerson
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ 
        success: false,
        message: 'Datos de entrada inválidos',
        errors: err.errors 
      });
      return;
    }
    
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Controlador para eliminar una persona
 * @param req - Request con el ID en los parámetros
 * @param res - Response con mensaje de confirmación
 */
export const deletePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar parámetro ID
    const { id } = idParamSchema.parse(req.params);
    
    const deletedPerson = await personService.deletePerson(Number(id));
    
    res.status(200).json({ 
      success: true,
      message: 'Persona eliminada exitosamente',
      data: {
        id: deletedPerson.id,
        dni: deletedPerson.dni,
        firstName: deletedPerson.firstName,
        lastName: deletedPerson.lastName
      }
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ 
        success: false,
        message: 'ID de persona inválido',
        errors: err.errors 
      });
      return;
    }
    
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Controlador para buscar personas
 * @param req - Request con el query de búsqueda
 * @param res - Response con las personas encontradas
 */
export const searchPersons = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar query de búsqueda
    const { query } = searchQuerySchema.parse(req.query);
    
    if (!query) {
      res.status(400).json({ 
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido' 
      });
      return;
    }
    console.log(`Buscando personas con término: "${query}"`);
    const persons = await personService.searchPersons(query);
    res.status(200).json({
      success: true,
      message: `Búsqueda completada para: "${query}"`,
      data: persons,
      count: persons.length
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ 
        success: false,
        message: 'Parámetros de búsqueda inválidos',
        errors: err.errors 
      });
      return;
    }
    
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ 
        success: false,
        message: err.message 
      });
      return;
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};
