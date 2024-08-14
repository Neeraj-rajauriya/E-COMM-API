import mongoose from "mongoose";

export const productSchema=new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    category:String,
    instock:Number,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ]
})