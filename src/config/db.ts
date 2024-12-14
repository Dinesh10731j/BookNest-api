import mongoose from "mongoose";
import { confi } from "./config"

const conectDB = async ()=>{
    try{

        mongoose.connection.on("connected",()=>{
            console.log('Connected to database ')
           
        });


        mongoose.connection.on('error',(err)=>{
            console.log('Error connecting database',err);
        });

        await mongoose.connect(confi.MONGO_URL as string)

    }catch(error){
        console.error('Failed to connect dataase',error);
        process.exit(1);

    }
}

export default conectDB