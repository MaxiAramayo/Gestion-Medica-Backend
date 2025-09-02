"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const auth_service_1 = require("./auth.service");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const auth_validation_1 = require("./auth.validation");
exports.loginController = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = auth_validation_1.loginSchema.parse(req.body);
    const result = await (0, auth_service_1.loginService)(email, password);
    res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
    });
});
