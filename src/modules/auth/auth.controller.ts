import { Request, Response } from 'express';
import { loginService } from '../../services/authService';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginService(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
