"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (password) => bcryptjs_1.default.hash(password, 10);
exports.hashPassword = hashPassword;
const comparePasswords = (plain, hash) => bcryptjs_1.default.compare(plain, hash);
exports.comparePasswords = comparePasswords;
