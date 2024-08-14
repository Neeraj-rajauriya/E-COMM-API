import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { LikeRepository } from "./like.repository.js";
export class LikeController{
    constructor(){
        this.likeRepository=new LikeRepository();
    }
     async LikeItem(req,res,next){
       try{
         const{id,type}=req.body;
         const userId=req.userID;
        if(type!='product' && type!='category'){
            res.status(404).send('Invalid type')
        }else{
            if(type=='product'){
               this.likeRepository.LikeProduct(userId,id)
            }else{
               this.likeRepository.LikeCategory(userId,id);
            }
        }
        return res.status(200).send('Liked');
        }
        catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with the Data',500);
      }
     }
     async getLikes(req,res,next){
        try{
         const{id,type}=req.query;
          const likes=await this.likeRepository.getLikes(type,id);
          return res.status(200).send(likes)
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with the Data',500);
        }
     }
}