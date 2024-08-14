import mongoose, { Types } from "mongoose";

export const likeSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'types'
    },
    Types:{
        type:String,
        enum:['product', 'category']
    }
})