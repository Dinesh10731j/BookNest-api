import express from "express";
import { createUser,userLogin } from "./userController";

const userRoute = express.Router();

userRoute.post('/register',createUser);
userRoute.post("/login", userLogin);




export default userRoute;