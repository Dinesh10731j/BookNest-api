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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const conectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connection.on("connected", () => {
            console.log('Connected to database ');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.log('Error connecting database', err);
        });
        yield mongoose_1.default.connect(config_1.confi.MONGO_URL);
    }
    catch (error) {
        console.error('Failed to connect dataase', error);
        process.exit(1);
    }
});
exports.default = conectDB;
