import { Request, Response } from "express";
import { loginService } from "./auth.service";
import asyncHandler from "../../utils/asyncHandler";
import { loginSchema } from "./auth.validation";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: result
    });
  }
);
