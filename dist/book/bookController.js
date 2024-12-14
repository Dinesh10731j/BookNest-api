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
exports.getSingleBook = exports.listBooks = exports.deleteBook = exports.updateBook = exports.createBook = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const path_1 = __importDefault(require("path"));
const http_errors_1 = __importDefault(require("http-errors"));
const bookModel_1 = __importDefault(require("./bookModel"));
const fs_1 = __importDefault(require("fs"));
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files.coverImage || !files.file) {
        return next((0, http_errors_1.default)(400, "Cover image and book file are required."));
    }
    ;
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path_1.default.resolve(__dirname, "../public/data/uploads", fileName);
    let uploadResult;
    try {
        uploadResult = yield cloudinary_1.default.uploader.upload(filePath, {
            public_id: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        });
    }
    catch (err) {
        console.error("Error uploading cover image:", err);
        return next((0, http_errors_1.default)(400, "Error uploading cover image."));
    }
    const bookFileName = files.file[0].filename;
    const bookFilePath = path_1.default.resolve(__dirname, "../public/data/uploads", bookFileName);
    let bookFileUploadResult;
    try {
        bookFileUploadResult = yield cloudinary_1.default.uploader.upload(bookFilePath, {
            resource_type: "raw",
            public_id: bookFileName,
            folder: "book-pdfs",
            format: "pdf",
        });
    }
    catch (err) {
        console.error("Error uploading book file:", err);
        return next((0, http_errors_1.default)(500, "Error while uploading book file."));
    }
    const { title, genre } = req.body;
    if (!title || !genre) {
        return next((0, http_errors_1.default)(400, "Title and genre are required."));
    }
    try {
        const _req = req;
        const newBook = yield bookModel_1.default.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url,
            file: bookFileUploadResult === null || bookFileUploadResult === void 0 ? void 0 : bookFileUploadResult.secure_url,
        });
        yield fs_1.default.promises.unlink(bookFilePath);
        yield fs_1.default.promises.unlink(filePath);
        res.status(201).json(newBook);
    }
    catch (err) {
        console.error("Error creating book in database:", err);
        return next((0, http_errors_1.default)(500, "Error saving book to database."));
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, genre } = req.body;
    const bookId = req.params.bookId;
    const book = yield bookModel_1.default.findOne({ _id: bookId });
    if (!book) {
        return next((0, http_errors_1.default)(404, "Book not found"));
    }
    // Check access
    const _req = req;
    if (book.author.toString() !== _req.userId) {
        return next((0, http_errors_1.default)(403, "You can not update others book."));
    }
    // check if image field is exists.
    const files = req.files;
    let completeCoverImage = "";
    if (files.coverImage) {
        const filename = files.coverImage[0].filename;
        const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        // send files to cloudinary
        const filePath = path_1.default.resolve(__dirname, "../public/data/uploads/" + filename);
        completeCoverImage = filename;
        const uploadResult = yield cloudinary_1.default.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: converMimeType,
        });
        completeCoverImage = uploadResult.secure_url;
        yield fs_1.default.promises.unlink(filePath);
    }
    // check if file field is exists.
    let completeFileName = "";
    if (files.file) {
        const bookFilePath = path_1.default.resolve(__dirname, "../public/data/uploads/" + files.file[0].filename);
        const bookFileName = files.file[0].filename;
        completeFileName = bookFileName;
        const uploadResultPdf = yield cloudinary_1.default.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: completeFileName,
            folder: "book-pdfs",
            format: "pdf",
        });
        completeFileName = uploadResultPdf.secure_url;
        yield fs_1.default.promises.unlink(bookFilePath);
    }
    const updatedBook = yield bookModel_1.default.findOneAndUpdate({
        _id: bookId,
    }, {
        title: title,
        description: description,
        genre: genre,
        coverImage: completeCoverImage
            ? completeCoverImage
            : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
    }, { new: true });
    res.json(updatedBook);
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bookId = req.params.bookId;
    const book = yield bookModel_1.default.findOne({ _id: bookId });
    if (!book) {
        return next((0, http_errors_1.default)(404, "Book not found"));
    }
    const _req = req;
    if (book.author.toString() !== _req.userId) {
        return next((0, http_errors_1.default)(403, "You can not update others book."));
    }
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId = coverFileSplits.at(-2) + "/" + ((_a = coverFileSplits.at(-1)) === null || _a === void 0 ? void 0 : _a.split(".").at(-2));
    const bookFileSplits = book.file.split("/");
    const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
    console.log("bookFilePublicId", bookFilePublicId);
    yield cloudinary_1.default.uploader.destroy(coverImagePublicId);
    yield cloudinary_1.default.uploader.destroy(bookFilePublicId, {
        resource_type: "raw",
    });
    yield bookModel_1.default.deleteOne({ _id: bookId });
    res.sendStatus(204);
});
exports.deleteBook = deleteBook;
const listBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookModel_1.default.find().populate("author", "name").exec();
        res.json(book);
    }
    catch (err) {
        console.log(err);
        return next((0, http_errors_1.default)(500, "Error while getting a book"));
    }
});
exports.listBooks = listBooks;
const getSingleBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield bookModel_1.default
            .findOne({ _id: bookId })
            .populate('author', 'name').exec();
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found."));
        }
        res.json(book);
    }
    catch (err) {
        console.log(err);
        return next((0, http_errors_1.default)(500, "Error while getting a book"));
    }
});
exports.getSingleBook = getSingleBook;
