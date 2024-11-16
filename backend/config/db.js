import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://deshanabhishek:20010925@cluster0.kfndn.mongodb.net/JAYA').then(()=>console.log("DB Connected"));
}