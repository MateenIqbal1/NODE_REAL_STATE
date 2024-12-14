import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
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