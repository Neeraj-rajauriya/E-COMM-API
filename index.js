import express from 'express';
import swagger from "swagger-ui-express";
import dotenv from 'dotenv';

// import swaggerDocument from './swagger.json';
const app=express();
import productRouter from "./src/features/Product/product.router.js"
import userRouter from './src/features/User/user.router.js';
// import basicAuth from './src/middleware/basicauthMiddleware.js';
import jwtAuth from './src/middleware/jwt.Middleware.js';
import cartRouter from './src/features/Cart/cart.router.js';
import apiDocs from "./swagger.json" assert{type:'json'};
import loggerMiddleware from './src/middleware/logger.middleware.js';
import {connectToMongodb,getDB} from './src/config/mongodb.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import { ApplicationError } from './src/ErrorHandler/applicationError.js';
import orderRouter from './src/features/Order/order.router.js';
import mongoose from 'mongoose';
import likeRouter from './src/features/Like/like.router.js';


dotenv.config();
app.get('/',(req,res)=>{
    res.send('Hi welcome to E-Commerce API');
});
// app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api-docs',swagger.serve,swagger.setup(apiDocs));
app.use(loggerMiddleware)
app.use('/api/product',jwtAuth,productRouter);
app.use('/api/user',userRouter);
app.use('/api/cart',jwtAuth,cartRouter);
app.use('/api/orders',jwtAuth,orderRouter);
app.use('/api/likes',jwtAuth,likeRouter)

app.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    res.status(500).send('Something went wrong, Please try later');  
    next();
})

app.use((req,res)=>{
    res.status(404).send("API not found");
})

app.listen(8000,()=>{
    console.log('Server is running fine on port number : 8000');
    connectUsingMongoose();
})