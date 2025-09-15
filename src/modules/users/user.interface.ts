// ============================================================================
// INTERFACES BASADAS EN EL SCHEMA DE PRISMA
// ============================================================================

// Usuario básico (coincide con el modelo User de Prisma)
export interface User {
  id: number;
  personId: number;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Usuario con relaciones (como se obtiene con include)
export interface UserWithRelations {
  id: number;
  personId: number;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  person: {
    id: number;
    dni: string;
    firstName: string;
    lastName: string;
    birthDate?: Date | null;
    gender?: string | null;
    phoneNumber?: string | null;
    primaryEmail?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    postalCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  role: {
    id: number;
    name: string;
  };
}

// ============================================================================
// INTERFACES PARA REQUESTS (INPUT)
// ============================================================================

// Para registrar usuario (coincide con registerUserSchema)
export interface RegisterUserInput {
  email: string;
  password: string;
  roleId: number;
  person: {
    dni: number;
    firstName: string;
    lastName: string;
    birthDate?: Date | null;
    gender?: string | null;
    phoneNumber?: string | null;
    primaryEmail?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    postalCode?: string | null;
  };
}

// Para actualizar usuario
export interface UpdateUserInput {
  email?: string;
  password?: string;
  roleId?: number;
  isActive?: boolean;
}

// ============================================================================
// INTERFACES PARA RESPONSES (OUTPUT)
// ============================================================================

// Usuario para respuesta (sin password)
export interface UserResponse {
  id: number;
  personId: number;
  email: string;
  roleId: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string; // ISO string para frontend
  updatedAt: string; // ISO string para frontend
  person: {
    id: number;
    dni: string;
    firstName: string;
    lastName: string;
    birthDate?: string | null; // ISO string para frontend
    gender?: string | null;
    phoneNumber?: string | null;
    primaryEmail?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    postalCode?: string | null;
  };
  role: {
    id: number;
    name: string;
  };
}

// Respuesta al crear usuario
export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

// Respuesta al obtener usuario
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

// Respuesta al obtener usuarios (lista)
export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: UserResponse[];
}

// Respuesta al actualizar usuario
export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

// Respuesta al eliminar usuario
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
