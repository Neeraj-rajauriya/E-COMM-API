import productModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
export default class productController{
    constructor(){
        this.productRepository=new ProductRepository();
    }

   async getAllProducts(req,res){
        try{
            const products=await this.productRepository.getAll();
            res.status(200).send(products)
        }catch(err){
            console.log(err);
            return res.status(500).send('something went Wrong!');
        }
    }

    async addProduct(req,res){
    try{
       const {name,price,sizes,category,description}=req.body;
       const newProduct=new productModel(
        name,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(','),
        description,
       )
       const createProduct= await this.productRepository.add(newProduct);
       res.status(201).send(createProduct);
    }catch(err){
        console.log(err);
         return res.status(500).send('something went Wrong!');
      }
    }

   async rateProduct(req,res,next){
        console.log(req.query);
        try{
        const userId=req.userID;
        const productId=req.body.productId;
        const rating=req.body.rating;
  
        await this.productRepository.rate(
                userId,
                productId,
                rating
            )
        
        return res.status(200).send('rating has been added');
       }
       catch(err){
        console.log(err);
        return res.status(200).send('Something went wrong')
       }
       next();
    }
   async getOneproduct(req,res){
        try{
            const id=req.params.id;
            const product=await this.productRepository.get(id);
            if(!product){
               res.status(404).send('Product is not found!')
            }else{
               res.status(200).send(product);
            }
        }
        catch(err){
            console.log(err);
             return res.status(200).send('Something went wrong')
        }

    }
    async filterProduct(req,res){
       try{
        const minPrice=req.query.minPrice;
        const maxPrice=req.query.maxPrice;
        const result=await this.productRepository.filter(
            minPrice,
            maxPrice
        )
        res.status(200).send(result);
       }
       catch(err){
        console.log(err);
         return res.status(200).send('Something went wrong')
    }
    }
    async averagePrice(req,res,next){
        try{
           const result=await this.productRepository.averagePricePerCategory();
           res.status(200).send(result);
        }catch(err){
         console.log(err);
         throw new ApplicationError('Something went wrong with the Data',500);
     }
        
     }

}
