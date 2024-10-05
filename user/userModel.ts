import mongoose from "mongoose";
import { User } from "./userType";

const userSchema = new mongoose.Schema<User>({
    name:{
        type:String,
        required:[true,'Name is required'],
    },

    email:{
        type:String,
        required:[true,'E-mail is required']
    },


    password:{
        type:String,
        required:[true,'Password is required'],
    }



},{timestamps:true});


const userModel = mongoose.model<User>("Users",userSchema);


export default userModel;