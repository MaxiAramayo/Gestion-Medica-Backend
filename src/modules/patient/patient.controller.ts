import {Request, Response } from "express";
import AppError from "../../utils/appError";
import * as patientService from "./patient.service";


export const getPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const patients = await patientService.getAllPatients();
        res.status(200).json({
            status: true,
            message: "Pacientes obtenidos exitosamente",
            data: patients,
        });

    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.body;


        const newPatient = await patientService.createPatient(req.body, dni);


        res.status(201).json({
            status: true,
            message: "Paciente creado exitosamente",
            data: newPatient,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};


export const getPatientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const patient = await patientService.getPatientById(id);

        if (!patient) {
            res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedPatient = await patientService.updatePatient(id, req.body);

        if (!updatedPatient) {
            res.status(404).json({
                success: false,
                message: "Paciente no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Paciente actualizado exitosamente",
            data: updatedPatient,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};

export const searchPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req;
        const patients = await patientService.searchPatients(query);

        res.status(200).json({
            success: true,
            data: patients,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};
