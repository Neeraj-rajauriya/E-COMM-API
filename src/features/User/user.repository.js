import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";

const UserModel=mongoose.model('user',userSchema)

export default class userRepository{
       async signUp(user){
      try {  
        const newUser=new UserModel(user);
        await newUser.save();
        return newUser;
      }

        catch(err){
            // console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                throw new ApplicationError('Something went wrong with the Data',500);
            }
        }
       }

       async signIn(email,password){
        try {  
            return await UserModel.findOne({email,password})
          }
            catch(err){
                console.log(err);
                throw new ApplicationError('Something went wrong with the Data',500);
            }
       }
       async findByEmail(email){
        try{
            return await UserModel.findOne({email});
        }
        catch(err){
            throw new ApplicationError('Something went wrong',500);
        }
    }
    async resetPassword(userId,newPassword){
        try{
            let user=await UserModel.findById(userId);
            if(user){
                user.password=newPassword;
                user.save();
            }else{
                throw new Error('User not found');
            }
        }
        catch(err){
            throw new ApplicationError('Something went wrong',500);
        }
    }

}