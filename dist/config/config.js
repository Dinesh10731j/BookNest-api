"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confi = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.confi = {
    PORT: process.env.PORT || 2025,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONNGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
};
