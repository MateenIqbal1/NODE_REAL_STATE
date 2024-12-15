import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser';
import listingRoute from './routes/listingRoute.js'
import {router as imageRoutes} from './routes/imageRoutes.js'
import cors from 'cors'
import path from 'path'
const PORT = process.env.PORT ;
dotenv.config();

const DATABASE_URL=process.env.MONGO_URL
try{
  
    await mongoose.connect(DATABASE_URL)
     console.log("successfully connected to mongodb...")
   }catch(error){
console.log(error)
   }

   const __dirname=path.resolve()


const app=express();
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin); // Dynamically set the origin
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); // Dynamically set origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    next();
});

app.use(cookieParser());
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);
app.options("*", cors({
    origin: process.env.FRONT_URL,
    credentials: true,
}));
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRoute);
app.use('/api/image',imageRoutes);

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})



app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,

    })
})