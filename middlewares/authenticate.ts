import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JwtPayload, verify } from "jsonwebtoken";
import { confi } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}
const Authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
 
  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, confi.JWT_SECRET as string) as JwtPayload;
  
    const _req = req as AuthRequest;
    _req.userId = decoded.userId as string ;

    next();
  } catch (err) {
    console.log(err)
    return next(createHttpError(401, "Token expired."));
  }
};

export default Authenticate;