//BASIC CALCULATIONS
// console.log("Hello World");
// console.log("Normal Javascript File");
// console.log(33/2);
//NEW IMPORT TYPE
//const http=require("http");
// import http from "http";
//IMPORT MODILE TYPES
// import ChampakChacha from "./features.js";
// import { gfName2,gfName3 } from "./features.js";
//import ChampakChacha,{ gfName2,gfName3 } from "./features.js"
//const gfName=require("./features");
// console.log(ChampakChacha);
//IMPORT MODULES AS AN OBJECT
// import * as myObj from "./features.js"
// console.log(myObj);
//IMPORT MODULE AS FUCNTIONS
// import { generateLovePercent} from "./features.js";
// console.log(generateLovePercent());
//CREATING SERVER
//console.log(http);
// const server=http.createServer(()=>{
//     console.log("Servered");
// });
//const server=http.createServer((req,res)=>{
    //console.log(req.url);
    //res.end("Noice");
    //res.end("<h1>Noice</h1>");
//});
//FILE READING AND RENDERING ASYNCHRONOUS
// import fs from "fs";
// import path from "path";
// const home=fs.readFile("./index.html",()=>{
//     console.log("File Read");
// })
// console.log(home);
//returns undefined because readFile is asynchronous so does not stop at file fetching, it fetches in its own time and continues to execute other statements.
//FILE READING AND RENDERING SYNCHRONOUS
//const home=fs.readFileSync("./index.html");
//console.log(home);
// const server=http.createServer((req,res)=>{
//     console.log(req.method);
//     if(req.url === "/about"){
//         res.end("<h1>About</h1>");
    //res.end(`<h1>Love is ${generateLovePercent()}</h1>`);
    //}
    //else if(req.url === "/"){
        //ASYNCHRONOUS FILE RENDERING
    //fs.readFile("./index.html",(err,home)=>{
    //res.end(home);//LINE FOR BOTH ASYNC AND SYNC
    //res.end("home");
    
    //});
// }
//     else if(req.url === "/contact"){
//     res.end("<h1>Contact page</h1>");
//     }
//     else{
//     res.end("<h1>Page not found</h1>");
//     }
// });

// server.listen(5000,()=>{
//     console.log("Server is working");
// })


 
//CREATING EXPRESS APP 
import express from 'express';
import path from "path";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend",
} ).then(()=>console.log("Database connected")).catch((e)=>console.log(e));
//FOR FORM 
// const messageschema=new mongoose.Schema({
//     name:String,email:String,
// });

// const Message=mongoose.model("Message",messageschema);

//FOR LOGIN
// const userSchema=new mongoose.Schema({
//     name:String,email:String,
// });
// const User=mongoose.model("User",userSchema);
const userSchema=new mongoose.Schema({
    name:String,email:String,password:String,
});
const User=mongoose.model("User",userSchema);
const app=express();
// express.static(path.join(path.resolve(),"public"));
app.use(express.static(path.join(path.resolve(),"public")));
//const users=[];
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//app.get("/",(req,res)=>{
    //res.send("Hi");
    //res.statusCode=404;
    //res.sendStatus(404);
    //res.sendStatus(500);
    //res.status(400).send("Meri Mrazi");
    // res.json({
    //     success:true,
    //     products:[],
    // });
    //const pathlocation=path.resolve();
    //console.log(path.resolve());
    //console.log(path.join(pathlocation,"nice"));
  //res.sendFile(path.join(pathlocation,"./index.html"));
  app.set("view engine","ejs");

  const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies;
    if(token){
        const decoded=jwt.verify(token,"jdudndj");
        //console.log(decoded);
        //res.render("logout");
        req.user=await User.findById(decoded._id);

        next();
    }else{
    res.redirect("/login");
    }
  }
    app.get("/",isAuthenticated,(req,res)=>{
       // BEFORE AUTHENTICATION BELOW LINE
    //res.render("index",{name:"Vatsala Vridhi"});
    // console.log(req.cookies);
    // consolee.log(req.cookies.token);
    //const token=req.cookies.token;
    // const {token}=req.cookies;
    // if(token){
        //console.log(req.user);
    res.render("logout",{name:req.user.name});
    //     next();
    // }
    // res.render("login");
    

});





app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    //console.log(req.user);
res.render("register");
});



app.post("/login",async(req,res)=>{
    //console.log(req.body);
    const {email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
        //return console.log("Register first");
        return res.redirect("/register");
    }
   //const isMatch=user.password===password;
   const isMatch=await bcrypt.compare(password,user.password);
   if(!isMatch)
   return res.render("login",{email,message:"Incorrect password"});
    // user=await User.create({name:name,email:email});
    const token=jwt.sign({_id:user._id},"jdudndj");
    //console.log(token);
   
        res.cookie("token",token,{ 
        expires:new Date(Date.now()+60*1000), httpOnly:true,
    });
    res.redirect("/");
});

app.post("/register",async(req,res)=>{
    //console.log(req.body);
    const {name,email,password}=req.body;
    let user=await User.findOne({email});
    if(user){
        //return console.log("Register first");
        return res.redirect("/login");
    }
    const hashedPassword=await bcrypt.hash(password,10);
   
    user=await User.create({name:name,email:email,password:hashedPassword});
    const token=jwt.sign({_id:user._id},"jdudndj");
    //console.log(token);
   
    // res.cookie("token",user._id,{
        res.cookie("token",token,{ 
        expires:new Date(Date.now()+60*1000), httpOnly:true,
    });
    res.redirect("/");
});













// app.get("/success",(req,res)=>{
//     res.render("success");
// });

//app.post("/",(req,res)=>{
   //console.log(req.body);
   //users.push({username:req.body.name,email:req.body.email});
   //res.render("success"); //OR below statement with app.get("/success")
 //  const messageData={username:req.body.name,email:req.body.email};
   //console.log(messageData);
   //res.redirect("/success");
//});

//API TO CONNECT WITH DATABASE
// app.post("/",async(req,res)=>{
//     const {name,email}=req.body;
//     await Message.create({name,email});
    // await Message.create({name:name,email:email});
    // await Message.create({name:req.body.name,email:req.body.email});
//     res.redirect("/success");
// });

//API FOR USERS
// app.get("/user",(req,res)=>{
//     res.json({
//         users,
//     });
// });

//API FOR MONGODB
// app.get("/add",async(req,res)=>{
//     await Message.create({name:"Vatsala",email:"vatsala@gmail.com"}).then(()=>{
//         res.send("Nice");
//     });
// });

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()), httpOnly:true,
    });
    res.redirect("/");
});
app.listen(5000,()=>{
    console.log("Server is working");
});