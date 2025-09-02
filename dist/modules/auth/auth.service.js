"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const db_1 = require("../../config/db");
const appError_1 = __importDefault(require("../../utils/appError"));
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const loginService = async (email, password) => {
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                person: true,
            },
        });
        if (!user || !user.isActive) {
            throw new Error("Usuario no encontrado o inactivo");
        }
        const isMatch = await (0, hash_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            throw new Error("Credenciales inválidas");
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role.id });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.roleId,
                isActive: user.isActive,
            },
        };
    }
    catch (error) {
        throw new appError_1.default("Error al iniciar sesión", 500);
    }
};
exports.loginService = loginService;
