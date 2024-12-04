const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  description: {
    type: String,
    default: ""
  },
  hasDiscount: {
    type: Boolean,
  },
  isFeatured: { 
    type: Boolean,
  },
  isDeleted: {
    type: Boolean, 
    default: false,
  },
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
