import { Response,Request,NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
//import createHttpError from "http-errors";
const createBook = async (req:Request,res:Response,next:NextFunction)=>{


        const files = req.files as {[fieldname:string]:Express.Multer.File[]}


const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
const fileName = files.coverImage[0].filename;
const filePath = path.resolve(
    __dirname,
    "../public/data/uploads",
    fileName
);




try{
    const uploadResult = await cloudinary.uploader.upload(filePath,{
        filename_override:fileName,
        folder:'book-covers',
        type:coverImageMimeType,
       

    });
    console.log('This is book-covers upload Result',uploadResult)

}catch(err){
    console.log('This is the error of uploadResult',err);
}
    

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname,'../public/data/uploads',bookFileName);

    try{
        const bookFileUploadResult = cloudinary.uploader.upload(bookFilePath,{
            resource_type:'raw',
            filename_override:bookFileName,
            folder:'book-pdfs',
            format:'pdf'
        });
    
        console.log(bookFileUploadResult);

    }catch(err){
        console.log(err);

    }

  



    res.json({});

    next();

 

    

   
    
   






}



export {createBook}