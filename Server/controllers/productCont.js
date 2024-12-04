const { trusted } = require("mongoose");
const Product = require("../models/Product");
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({isDeleted : false});
    res
      .status(200)
      .json({ msg: "Products Retrieved Successfully", data: products });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
const addProduct = async (req, res) => {
  try {
    const { title, price, imageURL, category, quantity, description, hasDiscount, isFeatured } = req.body;
    let product = await Product.findOne({ title });
    if (product) {
      return res.status(400).json({ msg: 'Product with this title already exists' });
    }
    product = new Product({
      title,
      price,
      imageURL,
      category,
      quantity,
      description,
      hasDiscount,
      isFeatured
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const updatedProduct = await Product.findByIdAndUpdate({_id : productId}, req.body);
    res.status(200).json({ msg: "Updated Product", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findOne({_id : productId})
    product.isDeleted = !product.isDeleted
    await product.save()
    console.log(product);
    res
      .status(200)
      .json({ msg: "Product Deleted Successfully", data: product });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const myProduct = await Product.findOne({_id : req.params.prodId});
    if (myProduct) {
      res
        .status(200)
        .json({ msg: "Product Fetched Successfully", data: myProduct });
    } else {
      res.status(200).json({ msg: "Product Not Found", data: {} });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Product", data: err });
  }
};
const getProductsByCat = async (req,res) => {
  try{
    const categoryName = String(req.params.catName).toLowerCase().trim()
    const products = await Product.find({category : categoryName});
    if(products.length != 0){
      res.status(200).json({ msg: "Products Retrieved Successfully", data: products });
    }else{
      res.status(200).json({ msg: "No Products Found", data: [] });
    }
  }catch(err){
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Products", data: err });
  }
}
const getFeaturedProducts = async (req,res) => {
  try{
    const products = await Product.find({ isFeatured: true });
    console.log(products)
    if(products.length!= 0){
      res.status(200).json({ msg: "Featured Products Retrieved Successfully", data: products });
    }else{
      res.status(200).json({ msg: "No Featured Products Found", data: [] });
    }
  }catch(err){
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Featured Products", data: err });
  }
}
const getProductsIds = async (req,res) => {
  try{
    let productIds = await Product.find({}, '_id')
    productIds = productIds.map(product => product._id.toString());
    res.status(200).json({ msg: "Product IDs Retrieved Successfully", data: Array.from(productIds) });
  }catch(err){
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Product IDs", data: err });
  }
}
const getProductsByName = async (req,res) => {
  try{
    const products = await Product.find({title : {
      $regex : req.params.prodName , $options : "i"
    }});
    if(products.length!= 0){
      res.status(200).json({ msg: "Products Retrieved Successfully", data: products });
    }else{
      res.status(200).json({ msg: "No Products Found", data: [] });
    }
  }catch(err){
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Products With Name", data: err });
  }
}
module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCat,
  getFeaturedProducts,
  getProductsIds,
  getProductsByName
};
