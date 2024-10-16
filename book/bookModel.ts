import mongoose from "mongoose";
import { Book } from "./bookType";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type:mongoose.Schema.ObjectId,
      required: true,
      ref:'User'
    },
    genre: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model<Book>("Book", bookSchema);

export default bookModel;
