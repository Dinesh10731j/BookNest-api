import express, { NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import globalMiddleware from "./middleware/globalMiddleware";
import { confi } from "./config/config";
import connectDB from "./config/db"
import createHttpError from "http-errors";
import userRoute from "./user/userRoute";
const app = express();

app.get("/",(req:express.Request,res:express.Response,next:NextFunction)=>{
    const error = createHttpError(400,'something went wrong');
    throw error;

    next();

})

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(globalMiddleware);
app.use('/api/user',userRoute);

const startServer = async () => {
  await connectDB();
  app.listen(confi.PORT, () => {
    console.log(`Server listening on port ${confi.PORT}`);
  });
};

startServer();
