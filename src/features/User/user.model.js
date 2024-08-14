import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class UserModel{
    constructor(name,email,password,type,id){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this._id=id;
    }

    static getAll(){
        return users;
    }
}

var users=[
    {
        name:'seller user',
        email:'seller@yahoo.in',
        password:"password1",
        type:"seller",
        id:1
    },
    {
        name:'customer user',
        email:'customer@yahoo.in',
        password:"password1",
        type:"customer",
        id:2
    }
]