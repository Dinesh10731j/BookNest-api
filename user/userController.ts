import express from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { confi } from "../config/config";
import { User } from "./userType";

const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
        const error = createHttpError(400, 'All fields are required');
        return next(error);
    }

    try {
        const alreadyExists = await userModel.findOne({ email });
        if (alreadyExists) {
            const error = createHttpError(400, 'User already exists');
            return next(error);
        }
    } catch {
        return next(createHttpError(500, 'Internal server error'));
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    
    let newUser: User;

    try {
        newUser = await userModel.create({ name, email, password: hashPassword });
    } catch {
        return next(createHttpError(500, 'Error creating user')); // Handle user creation error
    }

    // Creating JWT token
    const token = sign({ userId: newUser._id }, confi.JWT_SECRET as string, { expiresIn: '1h' });

    // Respond with success message
    res.status(201).json({
        accessToken: token,
        msg: 'User created successfully',
        success: true,
        id: newUser._id
    });
};

export default createUser;
