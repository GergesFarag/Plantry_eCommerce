require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./utils/db");
const multer = require("./utils/config");
const path = require("path");
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const cartRouter = require("./routers/cartRouter");
const port = 3000 || process.env.PORT;
app.use(cors({
  origin:'http://localhost:4200'
}))
app.use("/uploads" , express.static(path.join(__dirname , "uploads")));
app.post("/upload" , multer.single("file") , (req,res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  console.log("My File" , req.file);
  res.json({msg: "File uploaded" , fileName: req.file.filename})
})
app.use(express.json()); 
db.connect();
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
