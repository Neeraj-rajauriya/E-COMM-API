import express from 'express';
import UserController from './user.controller.js';
import userRepository from './user.repository.js';
import jwtAuth from '../../middleware/jwt.Middleware.js';
const userRouter=express.Router();

const userController=new UserController;
userRouter.post('/signup',(req,res,next)=>{
    userController.signUp(req,res,next);
});
userRouter.post('/signin',(req,res)=>{
    userController.signIn(req,res);
});
userRouter.put('/resetPassword',jwtAuth,(req,res)=>{
    userController.resetPassword(req,res);
})

export default userRouter;