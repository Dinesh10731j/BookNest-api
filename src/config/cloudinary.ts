import { v2 as cloudinary } from "cloudinary";
import { confi } from "./config";

cloudinary.config({
  cloud_name: confi.CLOUDINARY_NAME,
  api_key: confi.CLOUDINARY_KEY,
  api_secret: confi.CLOUDINARY_SECRET,
});


export default cloudinary;
