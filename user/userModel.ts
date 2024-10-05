import mongoose from "mongoose";
import { User } from "./userType";

const userSchema = new mongoose.Schema<User>({


    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true
    },


    password:{
        type:String,
        required:true
    }

});


const userModel = mongoose.model<User>("User",userSchema);


export default userModel;