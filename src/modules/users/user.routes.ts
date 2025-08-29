import { Router } from "express";
import { registerUser, getUsers, getUserById, updateUser } from "../users/user.controller";
import { loginController } from "../auth/auth.controller";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "../auth/auth.validation";
import { authLimiter } from "../../middlewares/rateLimit";
import { requireAuth } from "../auth/auth.middleware";

const router = Router();

// Rutas públicas
router.post("/users/register", registerUser);
router.post("/users/login", authLimiter, loginController);

// Rutas protegidas (requieren autenticación)
router.get("/users", requireAuth, getUsers);
router.get("/users/:id", requireAuth, getUserById);
router.put("/users/:id", requireAuth, updateUser);

export default router;
