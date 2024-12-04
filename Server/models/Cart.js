const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      reqQty: { 
        type: Number, 
        required: true, 
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQty: {
    type: Number,
    default: 0,
  },
});

CartSchema.methods.calculateTotals = async function () {
  const cart = this;
  let totalPrice = 0;
  let totalQty = 0;
  for (const item of cart.products) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      totalPrice += product.price * item.reqQty;
      totalQty ++;
    }
  }
  cart.totalPrice = totalPrice;
  cart.totalQty = totalQty;
};

CartSchema.pre("save", async function (next) {
  await this.calculateTotals();
  next();
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
