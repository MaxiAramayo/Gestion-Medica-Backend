import { Router } from "express";
import { registerUser, getUsers, getUserById } from "../users/user.controller";
import { loginController } from "../auth/auth.controller";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "../auth/auth.validation";
import { authLimiter } from "../../middlewares/rateLimit";
import { requireAuth } from "../auth/auth.middleware";

const router = Router();

router.post("/users/register", registerUser);

router.post("/users/login", authLimiter, loginController);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
