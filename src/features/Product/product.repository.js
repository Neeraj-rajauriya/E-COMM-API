import { ObjectId } from "mongodb";
import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { userSchema } from "../User/user.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";


const productModel=mongoose.model("product",productSchema);
const reviewModel=mongoose.model('review',reviewSchema);
const categoryModel=mongoose.model('category',categorySchema);


class ProductRepository{


    constructor(){
        this.collection="products";
    }
   
    async add(productData){
        try{
            console.log(productData);
            productData.category=productData.category.split(',').map(e=>e.trim());
            const newProduct=new productModel(productData);
            const savedProduct = await newProduct.save();

            await categoryModel.updateMany(
                {_id:{$in: productData.category}},
                {$push:{products: new ObjectId(savedProduct._id)}}
            )
        }
        catch(err){
              console.log(err);
              throw new ApplicationError('Something went wrong with the Data',500);
        }
   }
    // async add(newProduct){
    //      try{
    //            const db=getDB();
    //            const collection=db.collection(this.collection);
    //            await collection.insertOne(newProduct);
    //            return newProduct; 
    //      }
    //      catch(err){
    //            console.log(err);
    //            throw new ApplicationError('Something went wrong with the Data',500);
    //      }
    // }
    async getAll(){
          try{
               const db=getDB();
               const collection=db.collection(this.collection);
              return await collection.find().toArray();
          }
          catch(err){
              console.log(err);
              throw new ApplicationError('Something went wrong with the Data',500);
          }
    }
    async get(id){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
           return await collection.findOne({_id: new ObjectId(id)});
        }
       catch(err){
           console.log(err);
           throw new ApplicationError('Something went wrong with the Data',500);
       }
    }
    async filter(minPrice,categories){
        try{
         const db=getDB();
         const collection=db.collection(this.collection);
         let filterExpression={};
         if(minPrice){
             filterExpression.price={$gte: parseFloat(minPrice)}
         }
         categories = JSON.parse(categories.replace(/'/g, '"'));
            console.log(categories);
            if(categories){
                filterExpression={$or:[{category:{$in:categories}} , filterExpression]}
                // filterExpression.category=category
            }
        return collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:-1}}).toArray();
        }
        catch(err){
         console.log(err);
         throw new ApplicationError('Something went wrong with the Data',500);
     }
     }
    
    // async filter(minPrice,maxPrice,category){
    //    try{
    //     const db=getDB();
    //     const collection=db.collection(this.collection);
    //     let filterExpression={};
    //     if(minPrice){
    //         filterExpression.price={$gte: parseFloat(minPrice)}
    //     }
    //     if(maxPrice){
    //         filterExpression.price={$lte: parseFloat(maxPrice)}
    //     }
    //     if(category){
    //         filterExpression.category=category;
    //     }
    //    return collection.find(filterExpression).toArray();
    //    }
    //    catch(err){
    //     console.log(err);
    //     throw new ApplicationError('Something went wrong with the Data',500);
    // }
    // }

    // async rate(userId,productId,rating){
    //     try{
    //        const db=getDB();
    //        const collection=db.collection(this.collection);
    //        const product=await collection.findOne({_id:new ObjectId(productId)})
    //        const userRating=product?.ratings?.find(r=>r.userId==userId);
    //        if(userRating){
    //              await collection.updateOne({
    //                 _id:new ObjectId(productId),"rating.userId":new ObjectId(userId)
    //              },{
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //              })
    //        }else{
    //         await collection.updateOne({
    //             _id:new ObjectId(productId)
    //            },{
    //             $push:{ratings:{userId:new ObjectId(userId),rating}}
    //            })
    //        }
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError('Something went wrong with the Data',500);
    //     }
    // }
    // async rate(userId,productId,rating){
    //     try{
    //        const db=getDB();
    //        const collection=db.collection(this.collection);
    //              await collection.updateOne({
    //                 _id:new ObjectId(productId)
    //              },{
    //                $pull:{ratings:{userId:new ObjectId (userId)}}
    //              })
           
    //         await collection.updateOne({
    //             _id:new ObjectId(productId)
    //            },{
    //             $push:{ratings:{userId:new ObjectId(userId),rating}}
    //            })
    //        }
        
    
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError('Something went wrong with the Data',500);
    //     }
    // }

    async rate(userId,productId,rating){
        try{
            const productUpdate=await productModel.findById(productId);
            if(!productUpdate){
                throw new Error('Product not found');
            }
            const userReview=await reviewModel.findOne({product:new ObjectId(productId), user:new ObjectId(userId)});
            if(userReview){
                userReview.rating=rating;
                await userReview.save();
            }else{
                const newReview=new reviewModel(
                   { 
                    product:new ObjectId(productId),
                    user:new ObjectId(userId),
                    rating:rating           
                  }
                )
                newReview.save();
            }
        }
        
    
        catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with the Data',500);
        }
    }

    async averagePricePerCategory(){
        try{
            const db=getDB();
            return await db.collection(this.collection)
           .aggregate([
              { 
                $group:{
                _id:"$category",
                averagePrice:{$avg:"$price"}
               }
            }
           ]).toArray()
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong with the Data',500);
        }
    }

}
export default ProductRepository;