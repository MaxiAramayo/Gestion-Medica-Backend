var jwt = require('jsonwebtoken');
import { UserPayload } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1d';


export const generateToken = (UserPayload: object, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(UserPayload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};