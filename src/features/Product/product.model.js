import { ApplicationError } from '../../ErrorHandler/applicationError.js';
import UserModel from '../User/user.model.js'
export default class productModel{
    constructor(name,description,price,imageUrl,category,sizes,id){
         this._id=id;   
         this.name=name;
         this.price=price;
         this.imageUrl=imageUrl;
         this.description=description;
         this.category=category;
         this.sizes=sizes;
    }

    static add(product){
        product.id=products.length + 1;
        products.push(product);
        return product;
    }

    static getAll(){
        return products;
    }
    static get(id){
        const product=products.find((i)=>i.id==id);
        return product;
    }
    static filter(minPrice,maxPrice){
       const result=products.filter((product)=>{
        return(
          (!minPrice || product.price>=minPrice) && (!maxPrice || product.price<=maxPrice)
        )
       });
       return result;
    }
    static rateProduct(userId,productId,rating){

      // validate user
      const user=UserModel.getAll().find(
        (u)=>u.id == userId
      );
      if(!user){
        throw new ApplicationError('User not found',404);
      }
      // validate product
      const product=products.find(
        (p)=>p.id == productId
      );
      if(!product){
        throw new ApplicationError('Product not found',400);
      }
      //check if there are any rating and if not then add the rating array
      if(!product.ratings){
        product.ratings=[];
        product.ratings.push({
           userId:userId,
           rating:rating
        })
      }
      else{
        // check if user rating is already avialable
        const existingRatingIndex=product.ratings.findIndex(
          (r)=>r.userId == userId
        );
        if(existingRatingIndex>=0){
          product.ratings[existingRatingIndex]={
            userId:userId,
            rating:rating
          }
        }else{
          product.ratings.push({
            userId:userId,
            rating:rating
         })
        }
      }

      
    }
    
}
    
var products = [
    new productModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      ['M','L','XL'],
    ),
    new productModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      ['M','XL'],
    ),
    new productModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      ['XL','XXL'],
    ),
  ]
