export interface Patient {
    dni: number;
    name: string;
    lastName: string;
    birthDate: Date;
    socialSecurityNumber?: string;
    socialSecurityType?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PatientUpdate {
    name?: string;
    lastName?: string;
    birthDate?: Date;
    SocialSecurityNumber?: string;
    SocialSecurityType?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
}

export interface Doctor_Patient {
    doctorId: number;
    patientId: number;
    id: number;
} 

