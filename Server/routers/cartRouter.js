const express = require("express")
const router = express.Router();
const cartCont = require("../controllers/cartCont")
router.get("/",cartCont.getCart);
router.get("/totalPrice",cartCont.getTotalPrice);
router.get("/totalQty",cartCont.getTotalQty);
router.post("/",cartCont.addProduct);
router.post("/checkout",cartCont.checkout)
router.patch("/decQty",cartCont.decreaseProductQty);
router.delete("/:productId",cartCont.deleteProduct)
module.exports = router 