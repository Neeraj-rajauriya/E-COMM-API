

import OrderRepository from "./order.repository.js";
export default class ordercontroller{
    constructor(){
        this.orderRepository=new OrderRepository();
    }
    async PlaceOrder(req,res,next){
        try{
            const userId=req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send('Order is Created');
        }
    
    catch(err){
        console.log(err);
            return res.status(200).send("Something went wrong");
    }
}
}