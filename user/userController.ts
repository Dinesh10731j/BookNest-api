import express from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { confi } from "../config/config";
import { User } from "./userType";

const createUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, email, password } = req.body;

  // Check for required fields
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    const alreadyExists = await userModel.findOne({ email });
    if (alreadyExists) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch {
    return next(createHttpError(500, "Internal server error"));
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({ name, email, password: hashPassword });
  } catch {
    return next(createHttpError(500, "Error creating user")); // Handle user creation error
  }

  // Creating JWT token
  const token = sign({ userId:newUser._id }, confi.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  // Respond with success message
  res.status(201).json({
    accessToken: token,
    msg: "User created successfully",
    success: true,
    id: newUser._id,
  });
};

const userLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const isMatched = await bcrypt.compare(password, user?.password);

    if (!isMatched) {
      return next(createHttpError(400, "Username or password is incorrect"));
    }

    const token = sign({ userId: user._id }, confi.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ accessToken: token });
  } catch {
    next(createHttpError(500, "Internal server error")); 
  }
};

export { createUser, userLogin };
