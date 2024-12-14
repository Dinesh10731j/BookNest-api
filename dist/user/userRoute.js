"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./userController");
const userRoute = express_1.default.Router();
userRoute.post('/register', userController_1.createUser);
userRoute.post("/login", userController_1.userLogin);
exports.default = userRoute;
