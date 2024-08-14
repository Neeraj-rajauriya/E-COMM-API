import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt'

export default class UserController{
    constructor(){
        this.userRepository=new UserRepository();
    }
   async signUp(req,res,next){
    const {name,email,password,type}=req.body;
      try{  
        console.log(req.body);
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new UserModel(name,email,hashedPassword,type);
        await this.userRepository.signUp(user);
        res.status(201).send(user);
    }
        catch(err){
            next(err);
        //   console.log(err);
        //    return res.status(500).send('something went Wrong!');
        }

    }
    async signIn(req,res,next){
        try{
        const user=await this.userRepository.findByEmail(
            req.body.email
        )
        if(!user){
            res.status(400).send('Invalid Credentials');
        }else{
            const result = bcrypt.compare(req.body.password, user.password);
            if(result){
                const token=jwt.sign({
                    userID:user._id,
                    email:user.email
                },process.env.JWT_SECRET,
                {
                    expiresIn:"1hr"
                }
            )
            return res.status(200).send(token);   
            }else{
                return res.status(400).send('Invalid credentials');
            }
        }
        const result=await this.userRepository.signIn(
            req.body.email,
            req.body.password
        );
        if(!result){
            return res.status(400).send('Invalid credentials');
        }else{
            const token=jwt.sign({
                userID:result._id,
                email:result.email
            },'ASD7FGxc9vbnBJeH0shchd9882abnj21haCHShBC39HJA',
            {
                expiresIn:"1hr"
            }
        )
        return res.status(200).send(token);
    }
    }
    catch(err){
        next(err);
      console.log(err);
       return res.status(500).send('something went Wrong!');
    }
        }

    async resetPassword(req,res,next){
        const {newPassword}=req.body;
        const userId=req.userID;
        const hashedPassword=await bcrypt.hash(newPassword,12);
        try{
             await this.userRepository.resetPassword(userId,hashedPassword);
             res.status(200).send('Password is reset');
        }
        catch(err){
            console.log(err);
             return res.status(500).send('something went Wrong!');
          }
         
    }
    }

    // contoller for basic auth
    // signIn(req,res){
    //     const result=UserModel.signIn(
    //         req.body.email,
    //         req.body.password
    //     )
    //     if(!result){
    //         return res.status(400).send('Inavlid credentials');
    //     }else{
    //         return res.send('Login Sucessfull');
    //     }
    // }
