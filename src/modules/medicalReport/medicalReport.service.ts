import { MedicalReport, Prisma } from '@prisma/client';
import { prisma } from '../../config/db';
import AppError from '../../utils/appError';
import {
  CreateMedicalReportInput,
  UpdateMedicalReportInput,
  MedicalReportFilters,
  PaginationOptions,
  PaginatedResponse,
  MedicalReportWithRelations,
  MedicalReportSearchResult
} from './medicalReport.interface';

/**
 * Servicio para manejar operaciones relacionadas con reportes médicos
 * Incluye operaciones CRUD, búsqueda, filtrado y estadísticas
 */

/**
 * Crea un nuevo reporte médico
 * @param data - Datos del reporte médico
 * @returns Promise<MedicalReportWithRelations> - El reporte médico creado con relaciones
 * @throws AppError - 400 si hay errores de validación, 404 si no se encuentran entidades relacionadas
 */
export const createMedicalReport = async (
  data: CreateMedicalReportInput
): Promise<MedicalReportWithRelations> => {
  try {
    // Validar que el paciente existe
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
      include: { person: true }
    });

    if (!patient) {
      throw new AppError('Paciente no encontrado', 404);
    }

    if (patient.isDeleted) {
      throw new AppError('El paciente está marcado como eliminado', 400);
    }

    // Validar que el doctor existe y está activo
    const doctor = await prisma.doctorDetails.findUnique({
      where: { id: data.doctorId },
      include: { person: true }
    });

    if (!doctor) {
      throw new AppError('Doctor no encontrado', 404);
    }

    if (!doctor.isActive) {
      throw new AppError('El doctor no está activo', 400);
    }

    // Validar que el tipo de reporte existe
    const reportType = await prisma.reportType.findUnique({
      where: { id: data.reportTypeId },
      include: { area: true }
    });

    if (!reportType) {
      throw new AppError('Tipo de reporte no encontrado', 404);
    }

    // Validar centro de salud si se proporciona
    if (data.centerId) {
      const healthCenter = await prisma.healthCenter.findUnique({
        where: { id: data.centerId }
      });

      if (!healthCenter) {
        throw new AppError('Centro de salud no encontrado', 404);
      }
    }

    // Normalizar datos para Prisma
    const normalizedData = {
      patientId: data.patientId,
      doctorId: data.doctorId,
      reportTypeId: data.reportTypeId,
      centerId: data.centerId ?? null,
      title: data.title,
      content: data.content,
    };

    // Crear el reporte médico con imágenes en una transacción
    const medicalReport = await prisma.$transaction(async (tx) => {
      // Crear el reporte médico
      const report = await tx.medicalReport.create({
        data: normalizedData,
        include: {
          patient: {
            include: {
              person: {
                select: {
                  id: true,
                  dni: true,
                  firstName: true,
                  lastName: true,
                  birthDate: true,
                  gender: true,
                  phoneNumber: true,
                  primaryEmail: true,
                }
              }
            }
          },
          doctor: {
            include: {
              person: {
                select: {
                  id: true,
                  dni: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          reportType: {
            include: {
              area: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          healthCenter: true,
          reportImages: true,
        },
      });

      // Si se proporcionan imágenes, agregarlas
      if (data.images && data.images.length > 0) {
        const imageData = data.images.map(img => ({
          reportId: report.id,
          url: img.url,
          imageType: img.imageType || null,
          description: img.description || null
        }));

        await tx.reportImage.createMany({
          data: imageData
        });

        // Obtener el reporte con las imágenes incluidas
        return await tx.medicalReport.findUnique({
          where: { id: report.id },
          include: {
            patient: {
              include: {
                person: {
                  select: {
                    id: true,
                    dni: true,
                    firstName: true,
                    lastName: true,
                    birthDate: true,
                    gender: true,
                    phoneNumber: true,
                    primaryEmail: true,
                  }
                }
              }
            },
            doctor: {
              include: {
                person: {
                  select: {
                    id: true,
                    dni: true,
                    firstName: true,
                    lastName: true,
                  }
                }
              }
            },
            reportType: {
              include: {
                area: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            },
            healthCenter: true,
            reportImages: true,
          }
        });
      }

      return report;
    });

    return medicalReport as MedicalReportWithRelations;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new AppError('Referencias inválidas en los datos proporcionados', 400);
      }
    }
    throw new AppError('Error al crear el reporte médico', 500);
  }
};

/**
 * Obtiene todos los reportes médicos con filtros y paginación
 * @param filters - Filtros de búsqueda
 * @param pagination - Opciones de paginación
 * @returns Promise<PaginatedResponse<MedicalReportWithRelations>> - Reportes médicos paginados
 * @throws AppError - 500 si hay error interno del servidor
 */
export const getAllMedicalReports = async (
  filters: MedicalReportFilters = {},
  pagination: PaginationOptions = {}
): Promise<PaginatedResponse<MedicalReportWithRelations>> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = pagination;

    // Construir where clause
    const where: Prisma.MedicalReportWhereInput = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.doctorId) {
      where.doctorId = filters.doctorId;
    }

    if (filters.reportTypeId) {
      where.reportTypeId = filters.reportTypeId;
    }

    if (filters.centerId) {
      where.centerId = filters.centerId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    if (filters.searchTerm) {
      where.OR = [
        { title: { contains: filters.searchTerm, mode: 'insensitive' } },
        { content: { contains: filters.searchTerm, mode: 'insensitive' } },
        { patient: { person: { firstName: { contains: filters.searchTerm, mode: 'insensitive' } } } },
        { patient: { person: { lastName: { contains: filters.searchTerm, mode: 'insensitive' } } } },
        { patient: { person: { dni: { contains: filters.searchTerm, mode: 'insensitive' } } } },
      ];
    }

    // Construir orderBy clause
    let orderBy: Prisma.MedicalReportOrderByWithRelationInput = {};
    
    switch (sortBy) {
      case 'title':
        orderBy = { title: sortOrder };
        break;
      case 'patientName':
        orderBy = { patient: { person: { lastName: sortOrder } } };
        break;
      case 'doctorName':
        orderBy = { doctor: { person: { lastName: sortOrder } } };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    // Obtener total de registros
    const total = await prisma.medicalReport.count({ where });

    // Calcular offset
    const offset = (page - 1) * limit;

    // Obtener reportes médicos
    const medicalReports = await prisma.medicalReport.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        patient: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
                birthDate: true,
                gender: true,
                phoneNumber: true,
                primaryEmail: true,
              }
            }
          }
        },
        doctor: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        reportType: {
          include: {
            area: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        healthCenter: true,
        reportImages: true,
      },
    });

    // Calcular metadata de paginación
    const totalPages = Math.ceil(total / limit);

    return {
      data: medicalReports as MedicalReportWithRelations[],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error) {
    throw new AppError('Error al obtener los reportes médicos', 500);
  }
};

/**
 * Obtiene un reporte médico por su ID
 * @param id - ID del reporte médico
 * @returns Promise<MedicalReportWithRelations | null> - El reporte médico encontrado o null
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra
 */
export const getMedicalReportById = async (
  id: number
): Promise<MedicalReportWithRelations | null> => {
  try {
    if (!id || id <= 0) {
      throw new AppError('ID de reporte médico no válido', 400);
    }

    const medicalReport = await prisma.medicalReport.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
                birthDate: true,
                gender: true,
                phoneNumber: true,
                primaryEmail: true,
              }
            }
          }
        },
        doctor: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        reportType: {
          include: {
            area: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        healthCenter: true,
        reportImages: true,
      },
    });

    if (!medicalReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    return medicalReport as MedicalReportWithRelations;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error al obtener el reporte médico', 500);
  }
};

/**
 * Actualiza un reporte médico existente
 * @param id - ID del reporte médico a actualizar
 * @param data - Datos parciales a actualizar
 * @returns Promise<MedicalReportWithRelations> - El reporte médico actualizado
 * @throws AppError - 400 si los datos no son válidos, 404 si no se encuentra
 */
export const updateMedicalReport = async (
  id: number,
  data: UpdateMedicalReportInput
): Promise<MedicalReportWithRelations> => {
  try {
    if (!id || id <= 0) {
      throw new AppError('ID de reporte médico no válido', 400);
    }

    // Verificar que el reporte existe
    const existingReport = await prisma.medicalReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    // Validaciones similares al crear, pero solo para campos que se están actualizando
    if (data.patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      if (!patient || patient.isDeleted) {
        throw new AppError('Paciente no encontrado o eliminado', 404);
      }
    }

    if (data.doctorId) {
      const doctor = await prisma.doctorDetails.findUnique({
        where: { id: data.doctorId }
      });

      if (!doctor || !doctor.isActive) {
        throw new AppError('Doctor no encontrado o inactivo', 404);
      }
    }

    if (data.reportTypeId) {
      const reportType = await prisma.reportType.findUnique({
        where: { id: data.reportTypeId }
      });

      if (!reportType) {
        throw new AppError('Tipo de reporte no encontrado', 404);
      }
    }

    if (data.centerId) {
      const healthCenter = await prisma.healthCenter.findUnique({
        where: { id: data.centerId }
      });

      if (!healthCenter) {
        throw new AppError('Centro de salud no encontrado', 404);
      }
    }

    // Normalizar datos para actualización
    const normalizedData: any = {};
    
    if (data.patientId !== undefined) normalizedData.patientId = data.patientId;
    if (data.doctorId !== undefined) normalizedData.doctorId = data.doctorId;
    if (data.reportTypeId !== undefined) normalizedData.reportTypeId = data.reportTypeId;
    if (data.centerId !== undefined) normalizedData.centerId = data.centerId ?? null;
    if (data.title !== undefined) normalizedData.title = data.title;
    if (data.content !== undefined) normalizedData.content = data.content;

    const updatedReport = await prisma.medicalReport.update({
      where: { id },
      data: normalizedData,
      include: {
        patient: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
                birthDate: true,
                gender: true,
                phoneNumber: true,
                primaryEmail: true,
              }
            }
          }
        },
        doctor: {
          include: {
            person: {
              select: {
                id: true,
                dni: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        reportType: {
          include: {
            area: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        healthCenter: true,
        reportImages: true,
      },
    });

    return updatedReport as MedicalReportWithRelations;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError('Reporte médico no encontrado', 404);
      }
      if (error.code === 'P2003') {
        throw new AppError('Referencias inválidas en los datos proporcionados', 400);
      }
    }
    throw new AppError('Error al actualizar el reporte médico', 500);
  }
};

/**
 * Elimina un reporte médico
 * @param id - ID del reporte médico a eliminar
 * @returns Promise<MedicalReport> - El reporte médico eliminado
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra, 409 si hay dependencias
 */
export const deleteMedicalReport = async (id: number): Promise<MedicalReport> => {
  try {
    if (!id || id <= 0) {
      throw new AppError('ID de reporte médico no válido', 400);
    }

    // Verificar que el reporte existe
    const existingReport = await prisma.medicalReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    // Eliminar imágenes asociadas primero
    await prisma.reportImage.deleteMany({
      where: { reportId: id }
    });

    // Eliminar el reporte médico
    return await prisma.medicalReport.delete({
      where: { id }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError('Reporte médico no encontrado', 404);
      }
      if (error.code === 'P2003') {
        throw new AppError(
          'No se puede eliminar el reporte médico porque tiene dependencias asociadas',
          409
        );
      }
    }
    throw new AppError('Error al eliminar el reporte médico', 500);
  }
};

/**
 * Busca reportes médicos por título, contenido o datos del paciente
 * @param query - Término de búsqueda
 * @returns Promise<MedicalReportSearchResult[]> - Array de resultados de búsqueda
 * @throws AppError - 400 si el query está vacío, 500 si hay error interno
 */
export const searchMedicalReports = async (
  query: string
): Promise<MedicalReportSearchResult[]> => {
  try {
    if (!query || query.trim().length === 0) {
      throw new AppError('El término de búsqueda no puede estar vacío', 400);
    }

    const searchTerm = query.trim();

    const reports = await prisma.medicalReport.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
          { patient: { person: { firstName: { contains: searchTerm, mode: 'insensitive' } } } },
          { patient: { person: { lastName: { contains: searchTerm, mode: 'insensitive' } } } },
          { patient: { person: { dni: { contains: searchTerm, mode: 'insensitive' } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        patient: {
          select: {
            person: {
              select: {
                firstName: true,
                lastName: true,
                dni: true,
              }
            }
          }
        },
        doctor: {
          select: {
            person: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        reportType: {
          select: {
            name: true,
            area: {
              select: {
                name: true,
              }
            }
          }
        },
        healthCenter: {
          select: {
            name: true,
          }
        },
        _count: {
          select: {
            reportImages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limitar resultados de búsqueda
    });

    return reports.map(report => ({
      id: report.id,
      title: report.title,
      createdAt: report.createdAt,
      patientName: `${report.patient.person.firstName} ${report.patient.person.lastName}`,
      patientDni: report.patient.person.dni,
      doctorName: `${report.doctor.person.firstName} ${report.doctor.person.lastName}`,
      reportTypeName: report.reportType.name,
      areaName: report.reportType.area.name,
      centerName: report.healthCenter?.name,
      imageCount: report._count.reportImages,
      hasImages: report._count.reportImages > 0
    }));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error al buscar reportes médicos', 500);
  }
};



/**
 * Agregar una imagen a un reporte médico existente
 * @param reportId - ID del reporte médico
 * @param imageData - Datos de la imagen (URL)
 * @returns Promise<any> - La imagen agregada
 * @throws AppError - 404 si el reporte no existe, 400 si hay límite de imágenes
 */
export const addImageToReport = async (
  reportId: number, 
  imageData: { url: string; imageType?: string | null; description?: string | null }
): Promise<any> => {
  try {
    // Verificar que el reporte existe
    const existingReport = await prisma.medicalReport.findUnique({
      where: { id: reportId },
      include: {
        reportImages: true
      }
    });

    if (!existingReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    // Verificar límite de imágenes (máximo 20)
    if (existingReport.reportImages.length >= 20) {
      throw new AppError('No se pueden agregar más de 20 imágenes por reporte', 400);
    }

    const image = await prisma.reportImage.create({
      data: {
        reportId,
        url: imageData.url,
        imageType: imageData.imageType || null,
        description: imageData.description || null
      }
    });

    return image;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error interno del servidor al agregar imagen al reporte', 500);
  }
};

/**
 * Agregar múltiples imágenes a un reporte existente
 * @param reportId - ID del reporte médico
 * @param images - Array de datos de imágenes
 * @returns Promise<any[]> - Array de imágenes agregadas
 */
export const addMultipleImages = async (
  reportId: number, 
  images: Array<{ url: string; imageType?: string | null; description?: string | null }>
): Promise<any[]> => {
  try {
    const existingReport = await prisma.medicalReport.findUnique({
      where: { id: reportId },
      include: {
        reportImages: true
      }
    });

    if (!existingReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    // Verificar límite total de imágenes
    const totalImages = existingReport.reportImages.length + images.length;
    if (totalImages > 20) {
      throw new AppError(
        `No se pueden agregar ${images.length} imágenes. ` +
        `Límite máximo: 20, actuales: ${existingReport.reportImages.length}`, 
        400
      );
    }

    const imageData = images.map(img => ({
      reportId,
      url: img.url,
      imageType: img.imageType || null,
      description: img.description || null
    }));

    await prisma.reportImage.createMany({
      data: imageData
    });

    // Obtener las imágenes recién creadas
    const newImages = await prisma.reportImage.findMany({
      where: { 
        reportId,
        createdAt: {
          gte: new Date(Date.now() - 1000) // Imágenes creadas en el último segundo
        }
      },
      orderBy: { createdAt: 'desc' },
      take: images.length
    });

    return newImages;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error interno del servidor al agregar imágenes', 500);
  }
};

/**
 * Actualizar una imagen específica
 * @param imageId - ID de la imagen
 * @param data - Datos actualizados de la imagen
 * @returns Promise<any> - Imagen actualizada
 */
export const updateImage = async (
  imageId: number, 
  data: { url?: string; imageType?: string | null; description?: string | null }
): Promise<any> => {
  try {
    const existingImage = await prisma.reportImage.findUnique({
      where: { id: imageId }
    });

    if (!existingImage) {
      throw new AppError('Imagen no encontrada', 404);
    }

    const updatedImage = await prisma.reportImage.update({
      where: { id: imageId },
      data: {
        url: data.url,
        imageType: data.imageType,
        description: data.description
      }
    });

    return updatedImage;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error interno del servidor al actualizar la imagen', 500);
  }
};

/**
 * Eliminar una imagen específica
 * @param imageId - ID de la imagen
 */
export const deleteImage = async (imageId: number): Promise<void> => {
  try {
    const existingImage = await prisma.reportImage.findUnique({
      where: { id: imageId }
    });

    if (!existingImage) {
      throw new AppError('Imagen no encontrada', 404);
    }

    await prisma.reportImage.delete({
      where: { id: imageId }
    });

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error interno del servidor al eliminar la imagen', 500);
  }
};

/**
 * Obtener todas las imágenes de un reporte específico
 * @param reportId - ID del reporte médico
 * @returns Promise<any[]> - Array de imágenes del reporte
 */
export const getReportImages = async (reportId: number): Promise<any[]> => {
  try {
    const existingReport = await prisma.medicalReport.findUnique({
      where: { id: reportId }
    });

    if (!existingReport) {
      throw new AppError('Reporte médico no encontrado', 404);
    }

    const images = await prisma.reportImage.findMany({
      where: { reportId },
      orderBy: { createdAt: 'desc' }
    });

    return images;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error interno del servidor al obtener las imágenes', 500);
  }
};