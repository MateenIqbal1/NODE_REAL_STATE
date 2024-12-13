import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import Listing from "../models/listingModel.js";
export const test = (req, res) => {
    res.send('Hello World from index.js my latest file');
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "Unauthorized access"));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        if (req.body.username) {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return next(errorHandler(400, "Username is already taken"));
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });
        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};
 
export const deleteUser = async(req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'you are not authorized for this deletion'))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json({message:'User has been deleted Successfully'})
        
    } catch (error) {
        next(error)
    }
}
export const getUserListings=async(req,res,next)=>{
    if(req.user.id === req.params.id){
try {
    const listings=await Listing.find({userRef:req.params.id});
    res.status(200).json(listings)
} catch (error) {
    next(error)
}

    }else{
        return next(errorHandler(401,'You can only view your own listing'))
    }
}

export const getUser=async(req,res,next)=>{
    try {
         const user=await User.findById(req.params.id);
    if(!user) return next(errorHandler(404,'User not found!'));
    const {password:pass,...rest}=user._doc;
    res.status(200).json(rest)
    } catch (error) {
        next(error);
    }
   
}