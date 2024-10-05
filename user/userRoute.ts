import express from "express";

import createUser from "./userController";
const userRoute = express.Router();

userRoute.post('/register',createUser);




export default userRoute;