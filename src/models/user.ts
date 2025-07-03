export interface UserPayload {
  id: number;
  email: string;
  role: 'admin' | 'medico' | 'paciente';
}