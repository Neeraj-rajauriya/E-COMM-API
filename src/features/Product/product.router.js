import express from "express";
const router=express.Router();
import ProductController from "./product.controller.js";
import { upload } from "../../middleware/fileuploadMiddleware.js";

const productController=new ProductController();
router.get('/',productController.getAllProducts);
router.post('/',upload.single('imageUrl'),(req,res)=>{
    productController.addProduct(req,res)
});
router.get('/filter',(req,res)=>{
    productController.filterProduct(req,res);
});
router.post('/rate',(req,res,next)=>{
    productController.rateProduct(req,res,next);
});
router.get('/averagePrice',(req,res)=>{
    productController.averagePrice(req,res);
})
router.get('/:id',(req,res,next)=>{
    productController.getOneproduct(req,res)
});
export default router;