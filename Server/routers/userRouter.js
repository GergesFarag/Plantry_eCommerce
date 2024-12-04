const express = require("express");
const userCont = require("../controllers/userCont");
const auth = require("../utils/auth")
const router = express.Router();
router.get("/", userCont.getUsers);
router.get("/isAdmin" ,userCont.checkIsAdmin);
router.post("/login", userCont.userLogin);
router.post("/register", userCont.userRegister);
module.exports = router;
  