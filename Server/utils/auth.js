const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretKey;


exports.hashPassword = async(password)=>{
  return  await bcrypt.hash(password, 10);
} 

exports.compare = async(password,savedPassward)=>{
  return  await bcrypt.compare(password, savedPassward);
}

exports.createToken =  (myObj)=>{
   return jwt.sign(myObj,secretKey,{expiresIn:'1h'})
}

exports.authMiddleware = (req,res,next)=>{
 try
 {
    const token = req.header('Authorization')?.replace('Bearer ','');
  if(!token){
    return res.status(401).send('Access denied, accesstoken missing');
  }
  else{
    console.log("Token From Backend" , token);
    const verified = jwt.verify(token,secretKey);
    if(verified)
      {
    req.user = verified;
    next();
    }
    else{
        return res.status(401).send('Access denied,wrong accesstoken');
    }
  }
}
catch(err){
    return res.status(500).send(err.message);
}
}