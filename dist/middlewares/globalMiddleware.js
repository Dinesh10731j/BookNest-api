"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const globalMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message,
        errorStack: config_1.confi.NODE_ENV === 'development' ? error.stack : {}
    });
    next();
};
exports.default = globalMiddleware;
