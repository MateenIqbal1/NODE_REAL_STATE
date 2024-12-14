import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';
dotenv.config()

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
})

const storage=new multer.memoryStorage();

async function imageUploadUtil(file){
    const result=await cloudinary.uploader.upload(file,{
        resource_type:"auto",
    })
    return result;
}

const upload = multer({ storage, limits: { files: 6 } }); // Limit to a maximum of 6 files

export {upload ,imageUploadUtil}