import express from "express";
import multer from "multer";
import path from "path";
import Authenticate from "../middlewares/authenticate";
import {
  updateBook,
  listBooks,
  getSingleBook,
  deleteBook,
  createBook,
} from "./bookController";
const bookRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/createbook",
  Authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);
bookRouter.patch(
  "/:id",
  Authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRouter.get("/", listBooks);
bookRouter.delete("/:bookId", deleteBook);
bookRouter.get("/:bookId",Authenticate, getSingleBook);
export default bookRouter;
