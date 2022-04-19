const express = require("express");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");

const Jwt = require('jsonwebtoken');
const { response } = require("express");
const jwtKey ='e-project';

const app = express();

app.use(express.json()); //middleware

//signup API
app.post("/signup",verifyToken,async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign( {result} , jwtKey , {expiresIn:"3h"} , (err,token)=>{
    if(err){   
     res.send({ result: "Somethings went wrong please try after sometimes" });
    }
   res.send({result, auth:token});         
 })
});

//Login API
app.post("/login",verifyToken,async (req, res) => {
  if (req.body.username && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign( {user} , jwtKey , {expiresIn:"111h"} , (err,token)=>{
         if(err){   
          res.send({ result: "Somethings went wrong please try after sometimes" });
         }
        res.send({user, auth:token});         
      })

    } else {
      res.send({ result: "No User Found" });
    }
  } else {
    res.send({ result: "No User Found" });
  }
});

//ADD PRODUCT API

app.post("/add-product",verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

//fetch User List

app.get("/users-list",verifyToken,async(req,res)=>{
  let user = await User.find();
  if(user.length>0){
    res.send(user);
  }else{
    res.send({result:'NO User list in DB'});
  }
});

//fetch User details
app.get("/users-list/:id",verifyToken,async(req,res)=>{
  let user = await User.findOne({_id:req.params.id});
  if(user){
    res.send(user)
  }else{
    res.send({result:"No Such User found"})
  }
});

//fetch product list
app.get("/products-list",verifyToken,async(req,res)=>{
    let products = await Product.find();
    if(products.length>0){
      res.send(products)
    }else{
      res.send({result:'NO products found'})
    }
});

function verifyToken(req,resp,next){
  let token = req.headers['authorization']
  if(token){
          token = token.split(' ')[1];
           console.warn("middleware called if ",token)
           Jwt.verify(token,jwtKey,(err,valid)=>{
               if(err){
                    resp.status(401).send({result:"Please provide valid token"});
              }else{
                      next();
               }

           })

  }else{
      resp.status(403).send({result:"Please add token with header"});
  }
  
}

const port = 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
