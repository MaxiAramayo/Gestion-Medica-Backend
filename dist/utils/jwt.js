"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1d';
const generateToken = (UserPayload, expiresIn = JWT_EXPIRES_IN) => {
    return jwt.sign(UserPayload, JWT_SECRET, { expiresIn });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
