import express from "express";
import { LikeController } from "./likecontroller.js";

const likeRouter=express.Router();
const likecontroller=new LikeController();

likeRouter.post('/',(req,res,next)=>{
    likecontroller.LikeItem(req,res,next);
})

likeRouter.get('/',(req,res,next)=>{
    likecontroller.getLikes(req,res,next);
})

export default likeRouter;