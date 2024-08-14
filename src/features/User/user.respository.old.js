import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

class UserRepository{
       async signUp(newUser){
      
        try{
        //get the database;
        const db=getDB();
        //get the collection
        const collection =db.collection('users')

        // const newUser=new UserModel(name,email,password,type)
        // newUser.id=users.length+1;
        // users.push(newUser);

        //insert the document
        await collection.insertOne(newUser);
        return newUser;
        }
        catch(err){
            throw new ApplicationError('Something went wrong',500);
        }
    }
    async signIn(email,password){
        try{
        const db=getDB();
        const collection =db.collection('users')
       return await collection.findOne({email,password});
        }
        catch(err){
            throw new ApplicationError('Something went wrong',500);
        }
    }
    async findByEmail(email){
        try{
        const db=getDB();
        const collection =db.collection('users')
       return await collection.findOne({email});
        }
        catch(err){
            throw new ApplicationError('Something went wrong',500);
        }
    }

}

export default UserRepository;