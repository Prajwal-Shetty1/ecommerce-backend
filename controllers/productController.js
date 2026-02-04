import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js";
//Function to Add Product-it's for admin panel
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category,subCategory, sizes, bestseller } = req.body;

    // get images from req.files
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images =[image1, image2, image3, image4].filter((item)=> item !== undefined);
    // upload images to cloudinary
const imagesUrl = await Promise.all(
  images.map(async (item) => {
    const result = await cloudinary.uploader.upload(item.path, {
      resource_type: "image"
    });
    return result.secure_url;
  })
);


    //console.log(name, description, price, category,subCategory, sizes, bestseller);
    //console.log(images);
    //console.log(imagesUrl);  cloudinary url is obtained

    const productData = {
        name,description,category,price:Number(price),subCategory,
        bestseller:bestseller === 'true'?true:false,sizes:JSON.parse(sizes),image:imagesUrl,date:Date.now()
    }
    console.log(productData);
//To save in db
const product = new productModel(productData);
await product.save();

    res.json({ success: true,message:"Product Added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//Function to List Product
const listProducts =async(req,res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Function to Remove Product
const removeProduct =async(req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Product Deleted"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Function for Single Product Info
const singleProduct =async(req,res) => {
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true,product});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export {addProduct,listProducts,removeProduct,singleProduct};