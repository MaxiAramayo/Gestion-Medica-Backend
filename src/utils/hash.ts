import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePasswords = (plain: string, hash: string) => bcrypt.compare(plain, hash);
