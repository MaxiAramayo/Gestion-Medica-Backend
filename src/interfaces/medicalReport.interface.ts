export interface MedicalReport {
    id: number;
    patientId: number;
    doctorId: number;
    title: string;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicalReportUpdate {
    title?: string;
    description?: string;
    date?: Date;
}

export interface MedicalImage {
    id: number;
    reportId: number;
    imageUrl: string;
}