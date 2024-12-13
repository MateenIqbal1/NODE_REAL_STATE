import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup=async(req,res,next)=>{
   const {username , email , password}=req.body;
   const hashedpassword=bcryptjs.hashSync(password,10);
   const newUser= new User({username,email,password:hashedpassword});
   try {
     await newUser.save();
   res.status(201).json("User created successfully")
   } catch (error) {
   next(error);
   }
  
};
export const signin=async(req,res,next)=>{
const {email,password}=req.body;
try {
    const validUser=await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found'));
    const validPassword=bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(401,'wrong credentials'));
    const token= jwt.sign({id:validUser._id},process.env.JWT_SECRET);
    const {password:pass,...rest}=validUser._doc;
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

} catch (error) {
    next(error)
}
}


export const google=async(req,res,next)=>{
  try {
    const user=await User.findOne({email:req.body.email});
    if(user){
      const token= jwt.sign({id:user._id},process.env.JWT_SECRET);
      const {password:pass,...rest}=user._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

    }else{
      const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedpassword=bcryptjs.hashSync(generatedPassword,10);
      const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4), email:req.body.email,password:hashedpassword,avatar:req.body.photo})
      await newUser.save();
      const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET);
      const {password:pass,...rest}=newUser._doc;
      res.cookie('access_token',token,{httpOnly:false}).status(200).json(rest);


    }
  } catch (error) {
    next(error)
  }
}

export const checkVerified = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ isLoggedIn: true, userId: decoded.id });
  } catch (err) {
    res.status(401).json({ isLoggedIn: false });
  }
};
export const signOut=async(req,res,next)=>{
  try {
    res.clearCookie('access_token');
    res.status(200).json('logged out successfully');
  } catch (error) {
    next(error);
  }
}