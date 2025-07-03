import { Router } from 'express';
import { register, getUsers } from '../users/user.controller';
import { loginController } from '../auth/auth.controller';
import { validate } from '../../middlewares/validate';
import { loginSchema } from '../../validations/authSchema';
import { authLimiter } from '../../middlewares/rateLimit';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

router.post('/register', register);
router.get('/users', getUsers);
router.post('/login', authLimiter,validate(loginSchema),loginController);



export default router;
