import express from 'express';
import { HttpError } from 'http-errors';
import { confi } from '../config/config';


const globalMiddleware = (error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {


  const statusCode  = error.statusCode || 500;
 
  res.status(statusCode).json({
    message: error.message,
    errorStack: confi.NODE_ENV === 'development' ? error : {}
  });
  next();
};

export default globalMiddleware;