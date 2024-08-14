import mongoose, { Types } from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
const LikeModel=mongoose.model('like',likeSchema);
const ObjectId = mongoose.Types.ObjectId;
export class LikeRepository{

     async getLikes(type,id){
          return await LikeModel.find({
               likeable:new ObjectId(id),
               type:type
          }).populate('user').populate({path:'likeable',model:type})
     }
     async LikeProduct(userId,productId){
          try{
               const newLike=new LikeModel({
                    user:new ObjectId(userId),
                    likeable:new ObjectId(productId),
                    type:'product'
               })
               await newLike.save();
          }
          catch(err){
               console.log(err);
               throw new ApplicationError('Something went wrong with the Data',500);
         }  
     }

     async LikeCategory(userId,categoryId){
        try{
          const newLike=new LikeModel({
               user:new ObjectId(userId),
               product:new ObjectId(categoryId),
               type:'category'
          })
          await newLike.save();
        }catch(err){
          console.log(err);
          throw new ApplicationError('Something went wrong with the Data',500);
        }  
     }
}