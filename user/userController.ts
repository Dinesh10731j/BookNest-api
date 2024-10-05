
import express from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
const createUser = async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
const {name,email,password} = req.body;
if(!name || !email || !password){
    const error = createHttpError(400,'All fields are required');

    return next(error);
}

//checking if userAlready exits or not


const alreadyExists = await userModel.findOne({email});

if(alreadyExists){
    const error = createHttpError(400,'User Already exists');


    next(error);
}



}


export default createUser;