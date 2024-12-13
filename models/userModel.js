import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    avatar:{type:String,default:"https://assets.ajio.com/medias/sys_master/root/20231205/EK2r/656ed440ddf7791519b1e6b9/-473Wx593H-461119105-blue-MODEL2.jpg"}
},{timestamps:true});

const User=mongoose.model('User',userSchema)

export default User;