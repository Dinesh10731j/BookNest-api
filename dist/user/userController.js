"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.createUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModel_1 = __importDefault(require("./userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Check for required fields
    if (!name || !email || !password) {
        const error = (0, http_errors_1.default)(400, "All fields are required");
        return next(error);
    }
    try {
        const alreadyExists = yield userModel_1.default.findOne({ email });
        if (alreadyExists) {
            const error = (0, http_errors_1.default)(400, "User already exists");
            return next(error);
        }
    }
    catch (_a) {
        return next((0, http_errors_1.default)(500, "Internal server error"));
    }
    // Hash the password
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    let newUser;
    try {
        newUser = yield userModel_1.default.create({ name, email, password: hashPassword });
    }
    catch (_b) {
        return next((0, http_errors_1.default)(500, "Error creating user")); // Handle user creation error
    }
    // Creating JWT token
    const token = (0, jsonwebtoken_1.sign)({ userId: newUser._id }, config_1.confi.JWT_SECRET, {
        expiresIn: "1h",
    });
    // Respond with success message
    res.status(201).json({
        accessToken: token,
        msg: "User created successfully",
        success: true,
        id: newUser._id,
    });
});
exports.createUser = createUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        const isMatched = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatched) {
            return next((0, http_errors_1.default)(400, "Username or password is incorrect"));
        }
        const token = (0, jsonwebtoken_1.sign)({ userId: user._id }, config_1.confi.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ accessToken: token });
    }
    catch (_a) {
        next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.userLogin = userLogin;
