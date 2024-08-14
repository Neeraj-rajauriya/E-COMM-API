
import cartModel from "./cart.model.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import cartItemRepository from "./cartItem.repository.js";
export default class CartContoller{
    constructor(){
        this.cartItemRepository=new cartItemRepository();
    }
    async add(req,res){
    try{
        const{productId,quantity}=req.body;
        const userId=req.userID;   
        console.log("userId in controller",userId);
       await this.cartItemRepository.add(productId,userId,quantity);
        res.status(201).send('Cart has been updated');
    } catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }

    async get(req,res){
      try{
        const userId=req.userId;
        const items=await this.cartItemRepository.get(userId);
        // console.log('In the get function');
        return res.status(200).send(items);
      }catch(err){
        console.log(err);
        throw new ApplicationError('Something went wrong with the Data',500);
    }
    }

    async delete(req,res){
        const userId=req.userId;
        const cartItemId=req.params.id;
        const isdeleted= await this.cartItemRepository.delete(userId,cartItemId);
        if(!isdeleted){
          return  res.status(400).send("Item not found");
        }else{
            res.status(200).send('Item has been deleted!');
        }
    }
}