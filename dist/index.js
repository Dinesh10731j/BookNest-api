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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const globalMiddleware_1 = __importDefault(require("./middlewares/globalMiddleware"));
const config_1 = require("./config/config");
const db_1 = __importDefault(require("./config/db"));
const http_errors_1 = __importDefault(require("http-errors"));
const userRoute_1 = __importDefault(require("./user/userRoute"));
const bookRoute_1 = __importDefault(require("./book/bookRoute"));
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    const error = (0, http_errors_1.default)(400, 'something went wrong');
    throw error;
    next();
});
// Middlewares
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(globalMiddleware_1.default);
app.use('/api/user', userRoute_1.default);
app.use('/api/books', bookRoute_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    app.listen(config_1.confi.PORT, () => {
        console.log(`Server listening on port ${config_1.confi.PORT}`);
    });
});
startServer();
