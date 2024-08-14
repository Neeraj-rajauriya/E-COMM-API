import express from "express";
import CartContoller from "./cart.controller.js";
const router=express.Router();

const cartContoller=new CartContoller();
router.post('/',(req,res)=>{
    cartContoller.add(req,res);
});
router.get('/',(req,res)=>{
    cartContoller.get(req,res);
});
router.delete('/:id',(req,res)=>{
    cartContoller.delete(req,res);
});
export default router;
