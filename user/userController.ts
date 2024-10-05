
import express from "express"
import createHttpError from "http-errors";
const createUser = async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
const {name,email,password} = req.body;
if(!name || !email || !password){
    const error = createHttpError(400,'All fields are required');

    return next(error);
}

}


export default createUser;