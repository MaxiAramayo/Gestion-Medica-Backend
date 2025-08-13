import {Prisma, ReportType} from "@prisma/client";
import {prisma} from "../../config/db";
import AppError from "../../utils/appError";

interface ReportTypeInput {
  name: string;
  description?: string;
}

interface ReportTypeUpdate {
  name?: string;
  description?: string;
}

export const addReportType = async (data: ReportTypeInput): Promise<ReportType> => {
  try {

    //validar si el nombre existe
    const existingReportType = await prisma.reportType.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingReportType) {
      throw new AppError("El tipo de reporte ya existe", 400);
    }

    const reportType = await prisma.reportType.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      }
    });

    return reportType;
  } catch (error) {
    //error de prisma
   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al crear el tipo de reporte", 500);
  }
};

//todos deberan ser asi de completos los errores y la validacion

export const getAllReportTypes = async (): Promise<ReportType[]> => {
  try {
    const reportTypes = await prisma.reportType.findMany();
    return reportTypes;
  } catch (error) {
    //error de prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al obtener los tipos de reporte", 500);
  }
};

export const getReportTypeById = async (id: number): Promise<ReportType | null> => {
  try {

    const reportType = await prisma.reportType.findUnique({
      where: {
        id,
      },
    });

    if (!reportType) {
      throw new AppError("Tipo de reporte no encontrado", 404);
    }

    return reportType;
  } catch (error) {
    //error de prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al obtener el tipo de reporte", 500);
  }
};

export const updateReportType = async (id: number, data: ReportTypeUpdate): Promise<ReportType> => {
  try {
    
    
    const existingReportType = await prisma.reportType.findUnique({
      where: {
        id,
      },
    });

    if (!existingReportType) {
      throw new AppError("Tipo de reporte no encontrado", 404);
    }

    const updatedReportType = await prisma.reportType.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return updatedReportType;
  } catch (error) {
    //error de prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al actualizar el tipo de reporte", 500);
  }
};

export const deleteReportType = async (id: number): Promise<void> => {
  try {
    const existingReportType = await prisma.reportType.findUnique({
      where: {
        id,
      },
    });

    if (!existingReportType) {
      throw new AppError("Tipo de reporte no encontrado", 404);
    }

    await prisma.reportType.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    //error de prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al eliminar el tipo de reporte", 500);
  }
};

export const searchReportTypes = async (query: string): Promise<ReportType[]> => {
  try {
    const reportTypes = await prisma.reportType.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return reportTypes;
  } catch (error) {
    //error de prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("El tipo de reporte ya existe", 400);
      }
    }
    throw new AppError("Error al buscar los tipos de reporte", 500);
  }
};
