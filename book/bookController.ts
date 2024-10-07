import { Response, Request, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from 'fs'
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

 
    if (!files.coverImage || !files.file) {
        return next(createHttpError(400, 'Cover image and book file are required.'));
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, "../public/data/uploads", fileName);

    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: fileName,
            folder: 'book-covers',
            format: coverImageMimeType,
        });
    } catch (err) {
        console.error('Error uploading cover image:', err);
        return next(createHttpError(400, 'Error uploading cover image.'));
    }

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../public/data/uploads', bookFileName);

    let bookFileUploadResult;
    try {
        bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            public_id: bookFileName,
            folder: 'book-pdfs',
            format: 'pdf',
        });
       
       
    } catch (err) {
        console.error('Error uploading book file:', err);
        return next(createHttpError(500, 'Error while uploading book file.'));
    }


    const { title, genre} = req.body; 
    if (!title || !genre) {
        return next(createHttpError(400, 'Title and genre are required.'));
    }

    try {
        const _req = req as AuthRequest
        const newBook = await bookModel.create({
            title,
            genre,
            author:_req.userId, 
            coverImage:uploadResult?.secure_url,
            file: bookFileUploadResult?.secure_url
        });
        await fs.promises.unlink(bookFilePath);
        await fs.promises.unlink(filePath);
        res.status(201).json(newBook);

      
    } catch (err) {
        console.error('Error creating book in database:', err);
        return next(createHttpError(500, 'Error saving book to database.'));
    }
};

export { createBook };
