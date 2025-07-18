export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  image?: string;
  phone?: string;
  birthDate?: Date;
  isDeleted?: boolean;
  role: "admin" | "medico" | "paciente";
}
