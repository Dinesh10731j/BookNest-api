import { config } from "dotenv";
config();

export const confi = {
    PORT : process.env.PORT || 2025,
    NODE_ENV:process.env.NODE_ENV,
    MONGO_URL:process.env.MONNGO_URL,
    JWT_SECRET:process.env.JWT_SECRET

}