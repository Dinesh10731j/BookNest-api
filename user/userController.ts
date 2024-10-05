import express from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import { confi } from "../config/config";

const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
        const error = createHttpError(400, 'All fields are required');
        return next(error);
    }

    // Check if user already exists
    const alreadyExists = await userModel.findOne({ email });
    if (alreadyExists) {
        const error = createHttpError(400, 'User Already exists');
        return next(error);
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the new user with the hashed password
    const newUser = await userModel.create({ name, email, password: hashPassword });


//creating jwt token

const token = sign({userId:newUser._id},confi.JWT_SECRET as string,{expiresIn:'1h'});
res.json({accessToken:token})

    // Respond with success message
    ///res.status(201).json({ msg: 'User created successfully', success: true, id: newUser._id });
};

export default createUser;
