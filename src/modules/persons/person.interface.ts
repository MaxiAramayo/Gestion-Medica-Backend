export interface Person {
    id: number;
    dni: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
    primaryEmail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}