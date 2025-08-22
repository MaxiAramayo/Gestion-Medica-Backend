import { MedicalReport, Patient, DoctorDetails, ReportType, HealthCenter, ReportImage } from '@prisma/client';

/**
 * Interface para crear un nuevo reporte médico
 */
export interface CreateMedicalReportInput {
  patientId: number;
  doctorId: number;
  reportTypeId: number;
  centerId?: number | null;
  title: string;
  content: string;
  images?: Array<{
    url: string;
    imageType?: string | null;
    description?: string | null;
  }>; // URLs de imágenes opcionales
}

/**
 * Interface para actualizar un reporte médico existente
 */
export interface UpdateMedicalReportInput {
  patientId?: number;
  doctorId?: number;
  reportTypeId?: number;
  centerId?: number | null;
  title?: string;
  content?: string;
}

/**
 * Interface para filtros de búsqueda de reportes médicos
 */
export interface MedicalReportFilters {
  patientId?: number;
  doctorId?: number;
  reportTypeId?: number;
  centerId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

/**
 * Interface para paginación de resultados
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'patientName' | 'doctorName';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interface para respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface para reporte médico con todas las relaciones
 */
export interface MedicalReportWithRelations extends MedicalReport {
  patient: Patient & {
    person: {
      id: number;
      dni: string;
      firstName: string;
      lastName: string;
      birthDate: Date;
      gender: string;
      phoneNumber?: string | null;
      primaryEmail?: string | null;
    };
  };
  doctor: DoctorDetails & {
    person: {
      id: number;
      dni: string;
      firstName: string;
      lastName: string;
    };
  };
  reportType: ReportType & {
    area: {
      id: number;
      name: string;
    };
  };
  healthCenter?: HealthCenter | null;
  reportImages: ReportImage[];
}

/**
 * Interface para resultado de búsqueda simplificado
 */
export interface MedicalReportSearchResult {
  id: number;
  title: string;
  createdAt: Date;
  patientName: string;
  patientDni: string;
  doctorName: string;
  reportTypeName: string;
  areaName: string;
  centerName?: string;
}