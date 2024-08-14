import { ObjectId } from "mongodb";
import {getClient, getDB} from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }

    async placeOrder(userId){
      try 
      { 
        const client=getClient();
        const session=client.startSession();
        const db=getDB();
        session.startTransaction();
        const items=await this.getTotalAmount(userId,session);
        const finalTotalAmount=items.reduce((acc,item)=>acc+item.totalamount,0);
        console.log(finalTotalAmount);

        //create an order
        const newOrder=new OrderModel(new ObjectId(userId), finalTotalAmount ,new Date());
        await db.collection(this.collection).insertOne(newOrder);

        //reduce the stock
        for(let item of items){
            await db.collection(this.collection).updateOne(
            {_i:item.productId},
            {$inc:{stock:-item.quantity}},{session}
        )
        }
        throw new Error("Something is wrong in placeOrder")

        //clear the cart items
        await db.collection("cart").deleteMany({
            userId:new Object(userId)
        })
      }
      catch(err){
        console.log(err);
        throw new ApplicationError('Something went wrong with the Data',500);
    }

    }
    async getTotalAmount(userId,session){
        const db=getDB();
       const items= await db.collection("cart").aggregate([

            //get cartItem for the users
            {
                $match:{userId: new ObjectId(userId)}
            },

            //get the product from the products collection
          {  
            $lookup:{
                  from:"products",
                  localField:"productId",
                  foreignField:"_id",
                  as:"productInfo"
            }
        },
        //unwind the productInfo
        {
            $unwind:"$productInfo"
        },
        //calculate totla amount for each cart item
        {
            $addFields:{
                "totalamount":{
                    $multiply:["$productInfo.price","$quantity"]
                }
            }
        }
        ],{session}).toArray();
        return items;

    }
}