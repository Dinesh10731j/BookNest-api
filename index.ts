import express, { NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import globalMiddleware from "./src/middlewares/globalMiddleware";
import { confi } from "./src/config/config";
import connectDB from "./src/config/db"
import createHttpError from "http-errors";
import userRoute from "./src/user/userRoute";
import bookRouter from "./src/book/bookRoute";
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
app.use('/api/books',bookRouter);

const startServer = async () => {
  await connectDB();
  app.listen(confi.PORT, () => {
    console.log(`Server listening on port ${confi.PORT}`);
  });
};

startServer();
