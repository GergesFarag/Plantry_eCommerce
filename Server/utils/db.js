const mongoose  = require("mongoose");
const connect = async()=>{
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error While Connecting", err);
    });
}
module.exports = {connect}