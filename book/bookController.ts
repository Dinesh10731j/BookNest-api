import { Response,Request,NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
const createBook = async (req:Request,res:Response,next:NextFunction)=>{

    try{
        const files = req.files as {[fieldname:string]:Express.Multer.File[]}

const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
const fileName = files.coverImage[0].fieldname;

const filePath = path.resolve(__dirname,'../public/data/uploads',fileName)
    const uploadResult = await cloudinary.uploader.upload(filePath,{
        filename_override:fileName,
        folder:'books-Cover',
        type:coverImageMimeType

    });

   if(!uploadResult){
    return next(createHttpError(400,'Failed to upload files'));
   }


    

    }catch{

        next(createHttpError(500,'Internal server error'));

    }
   
    



}



export {createBook}