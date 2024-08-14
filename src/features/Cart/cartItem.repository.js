import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";

export default class cartItemRepository{
    constructor(){
        this.collection="cart";
    }
    async add(productId,userId,quantity){
     try{
        const db=getDB();
        const collection=db.collection(this.collection);
        const id=await this.getNextCounter(db);
        // await collection.updateOne(
        //   {productId:new ObjectId(productId),userId:new ObjectId(userId)},
        //   {
        //     $setOnInsert: {_id:id},
        //     $inc:{
        //       quantity:quantity
        //   }},
        // //   {
        // //     $setOnInsert: {_id:id},
        // //     $inc:{
        // //     quantity: quantity
        // // }},
        //   {upsert:true});

        await collection.updateOne(
          {productId:new ObjectId(productId), userId:new ObjectId(userId)},
          {
              $setOnInsert: {_id:id},
              $inc:{
              quantity: quantity
          }},
          {upsert: true})



        // await collection.updateOne(
        //   {productID:new ObjectId(productId), userID:new ObjectId(userId)},
        //   {
        //       // $setOnInsert: {_id:id},
        //       $inc:{
        //       quantity: quantity
        //   }},
        //   {upsert: true})

     }
     catch(err){
        console.log(err);
        throw new ApplicationError('Something went wrong with the Data',500);
    }
    }
    async get(userId){
      try{
        const db=getDB();
        const collection=db.collection(this.collection);
        const result=  await collection.find({userId:new ObjectId(userId)}).toArray();
       
      }
      catch(err){
        console.log(err);
        throw new ApplicationError('Something went wrong with the Data',500);
    }
    }
    async delete(userId,cartItemId){
        try{
          const db=getDB();
          const collection=db.collection(this.collection);
          const result= await collection.deleteOne({_id:new ObjectId(cartItemId)},{userId:new ObjectId(userId)});
          return result.deletedCount>0;
        }
        catch(err){
          console.log(err);
          throw new ApplicationError('Something went wrong with the Data',500);
      }
      }

      // async getNextCounter(db){
      //   const resultDocument=await db.collection("counters").findOneAndUpdate(
      //       {_id:'cartItemId'},
      //       {$inc:{value:1}},
      //       {returnDocument:'after'}
      //   )
      //   console.log(resultDocument);
      //   return resultDocument.value.value;
      // }
      async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value: 1}},
            {returnDocument:'after'}
        )  
        console.log(resultDocument);
        return resultDocument.value;
    }
     

} 