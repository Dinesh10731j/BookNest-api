"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const bookController_1 = require("./bookController");
const bookRouter = express_1.default.Router();
const upload = (0, multer_1.default)({
    dest: path_1.default.resolve(__dirname, "../public/data/uploads"),
    limits: { fileSize: 3e7 },
});
bookRouter.post("/createbook", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookController_1.createBook);
bookRouter.patch("/:id", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookController_1.updateBook);
bookRouter.get("/", bookController_1.listBooks);
bookRouter.delete("/:bookId", bookController_1.deleteBook);
bookRouter.get("/:bookId", authenticate_1.default, bookController_1.getSingleBook);
exports.default = bookRouter;
