const express = require("express");
const productCont = require("../controllers/productCont");
const router = express.Router();
router.get("/", productCont.getProducts);
router.get("/featured" , productCont.getFeaturedProducts)
router.get("/IDs" , productCont.getProductsIds)
router.get("/:prodId" , productCont.getProductById)
router.get("/:catName" , productCont.getProductsByCat)
router.get("/search/:prodName" , productCont.getProductsByName)
router.post("/", productCont.addProduct);
router.put("/:productId", productCont.updateProduct);
router.delete("/:productId", productCont.deleteProduct);
module.exports = router;
