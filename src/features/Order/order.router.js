import express from 'express'
import Ordercontroller from './order.controller.js';
const orderRouter=express.Router();
const ordercontroller=new Ordercontroller();

orderRouter.post('/',(req,res)=>{
    ordercontroller.PlaceOrder(req,res);
})

export default orderRouter;