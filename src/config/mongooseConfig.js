import mongoose from "mongoose";
import dotenv from 'dotenv';
import { categorySchema } from "../features/Product/category.schema.js";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose= async()=>{
    try{
           await mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
           console.log('MongoDB is connected using mongoose');
           addCategories();
    }
    catch(err){
         console.log(err);
    }
}

async function addCategories(){
    const categoryModel=mongoose.model('category',categorySchema);
    const categories=await categoryModel.find();
    if(!categories  || categories.length==0){
        await categoryModel.insertMany([{name:'books'},{name:'clothing'},{name:'Electronics'}])
    }
    console.log("categories are added");
}