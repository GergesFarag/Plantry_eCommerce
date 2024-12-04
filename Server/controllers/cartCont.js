const Cart = require("../models/Cart");
const Product = require("../models/Product");
const JWT = require("jsonwebtoken");
let counter = 1
const addProduct = async (req, res) => {
  try {
    const { title: productTitle, quantity : reqQty } = req.body;
    console.log(req.body);
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: null });
    }
    token = token.replaceAll('"', "").trim();
    let decoed = JWT.verify(token, process.env.JWT_SECRET);

    let cart = await Cart.findOne({ user: decoed.id }).populate("products.product");
    let product = await Product.findOne({ title: productTitle });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!cart) {
      cart = new Cart({ user: decoed.id, products: [] , totalPrice: 0 , totalQty : 0});
    }
    const productInCart = cart.products.find(
      (p) => p.product._id.toString() == product._id
    );
    if (productInCart) {
      productInCart.reqQty += reqQty;
    } else {
      cart.products.push({ product: product, reqQty });
    }
    cart.totalQty = cart.products.length;
    cart.totalPrice += product.price * reqQty;

    await cart.save();
    console.log(`Cart At : ${counter} time : ` ,cart);
    counter++;
    res.json({ msg: "Product Added Successfully !", data: cart });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err.msg, data: null });
  }
};
const getCart = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: null });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    const myCart = await Cart.findOne({ user: decoed.id })
      .populate("user")
      .populate("products.product");
    res.json({ msg: "Fetched Cart Successfully", data: myCart });
  } catch (err) {
    console.log(err);
    res.json({ msg: "Error While Fetching Cart", data: err });
  }
};
const deleteProduct = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: 0 });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    let cart = await Cart.findOne({ user: decoed.id }).populate("products.product");
    if (cart.products.length == 0) {
      return res.json({ msg: "Cart Products is empty" });
    }
    cart.products = cart.products.filter(
      (product) => product.product._id.toString() != req.params.productId
    );
    console.log("CART AFTER DELETING:" , cart);
    await cart.save();
    return res.json({ msg: "Product Deleted Successfully !", data: cart });
  } catch (err) {
    res.status(400).json({ msg: "Error While Deleting From Cart" });
  }
};
const getTotalPrice = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: 0 });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded From Total Price : ", decoed);
    const totalPrice = await Cart.findOne({ user: decoed.id }, "totalPrice");
    res.json({
      msg: "Fetched Total Price Successfully",
      data: totalPrice?.totalPrice || 0,
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: "Error While Fetching Total Price", data: err });
  }
};
const getTotalQty = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: 0 });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    const totalQty = await Cart.findOne({ user: decoed.id }, "totalQty");
    res.json({
      msg: "Fetched Total Quantity Successfully",
      data: totalQty?.totalQty || 0,
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: "Error While Fetching Total Quantity", data: err });
  }
};
const decreaseProductQty = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: null });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: decoed.id })
      .populate("products.product")
      .populate("user");
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const product = cart.products.find(
      (product) => product.product._id.toString() === req.body.productId
    );
    if (!product)
      return res.status(404).json({ error: "Product not found in cart" });
    if (product.reqQty <= 1) {
      cart.products = cart.products.filter(
        (p) => p.product._id.toString() !== req.body.productId
      );
      cart.totalQty--;
    } else {
      product.reqQty--;
    }
    cart.totalPrice -= +product.product.price;
    await cart.save();
    res.json({ msg: "Product quantity decreased successfully!", data: cart });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ msg: "Error while decreasing product quantity", data: null });
  }
};
const checkout = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (token == "null") {
      return res.status(200).json({ msg: "User is not loggedIn", data: null });
    }
    token = token.replaceAll('"', "");
    let decoed = JWT.verify(token, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: decoed.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.products.forEach(async (product) => {
      await Product.findByIdAndUpdate(
        product.product,
        { $inc: { quantity: -product.reqQty } },
        { new: true }
      );
    });
    cart.products = [];
    cart.totalPrice = 0;
    cart.totalQty = 0;
    await cart.save();
    res.json({ msg: "Cart Checkout Successfully", data: cart });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error While Checking Out", data: err });
  }
};
module.exports = {
  addProduct,
  getCart,
  deleteProduct,
  getTotalPrice,
  getTotalQty,
  decreaseProductQty,
  checkout,
};
