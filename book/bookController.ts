import { Response,Request,NextFunction } from "express"
const createBook = async (req:Request,res:Response,next:NextFunction)=>{
    res.json({msg:'Hello world'});
    console.log('files',req.files)
    
next()


}



export {createBook}