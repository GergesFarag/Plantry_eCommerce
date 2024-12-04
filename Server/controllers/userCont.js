const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = JWT.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      console.log("Token From Up", token);
      res.status(200).json({ msg: "User Login Successfully ", data: token });
    }else{
      return res.status(200).json({ msg: "Username or Password is invlaid", data: null });
    }
  } catch (err) {
    res.status(200).json({ msg: "Error While User Login", data: err });
  }
};
const userRegister = async (req, res) => {
  let role = 1;
  const { username, email, password } = req.body;
  try {
    const isExist = await User.find({ email });
    if (isExist.length != 0) {
      return res
        .status(200)
        .json({ msg: "Username or Password is invlaid", data: null });
    }
    if (username == "admin" && password == "admin") {
      role = 0;
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      name: username,
      email: email,
      password: hashedPass,
      role: role,
    });
    await user.save();
    const token = JWT.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
    res.status(200).json({ msg: "User Created Successfully", data: token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error While Register", data: err });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ msg: "Users Fetched Successfully", data: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error While Fetching Users", data: err });
  }
};
const checkIsAdmin = async (req, res) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("Access denied, accesstoken missing");
    } else {
      token = token.replaceAll('"', "");
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      console.log("Decoded", decoded);
      if (+decoded.role === 0) {
        res.status(200).json({ msg: "User is Admin", data: true });
      } else {
        res.status(200).json({ msg: "User is not Admin", data: false });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error While Checking Admin", data: err });
  }
};

module.exports = {
  userLogin,
  getUsers,
  userRegister,
  checkIsAdmin,
};
