import dotenv from 'dotenv';

dotenv.config();  //load .env file for u

export const PORT = process.env.PORT ||3000;