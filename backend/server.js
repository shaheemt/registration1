const express = require("express");
const app  = express();
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

dotenv.config({path:"./config/config.env"})
const staticPathregister = (path.join(__dirname , "../front-end/Register"));
const staticPathstyle = (path.join(__dirname , "../front-end"));
app.use(express.static(staticPathregister));
app.use(express.static(staticPathstyle));

const register = path.join(__dirname, '../front-end/Register/register.html');
const login = path.join(__dirname, '../front-end/Register/login.html');
const home = path.join(__dirname, '../front-end/index.html');

app.get("/",(req,res) =>{

    const {token} = req.cookies
   if(token){
    jwt.verify(token,process.env.JWT_SECRET_KEY, function(err,result){
        if(result){
            res.sendFile(home)
        }else{
            res.sendFile(login)
        }
    })
   }else{
    sendFile(register)
   }  
})

app.get("/login", (req,res)=>{
    res.sendFile(login)
})

app.post("/signup", (req,res) => {

    const users = [
    {username:'shaheem',password:123456},
    {username:'Dhawood',password:654321}
    ]

    const {username,password} = req.body
    const user = users.find((data) => data.username == username && data.password == password) ;

    if (user) {
        const data = {
            username,
            date:Date(),
        }
        const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"10min"});
        console.log(token);
        res.cookie("token", token).sendFile(home)
    }else{
        res.send("invalid user")
    }
 
})

app.post("/login", (req,res) => {

    const users = [
        {useremail:'shaheem@gmail.com',password:123456},
        {useremail:'Dhawood@gmail.com',password:654321}
    ]

    const {useremail,password} = req.body
    const user = users.find((data) => data.useremail == useremail && data.password == password) ;

    if (!user) {
        res.send("invalid user. please sign up")
    }else{
        res.sendFile(home)
    }
})

app.get("/home", (req,res) => {

    const {token} = req.cookies
   
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, function(err,result){
            if(result){
                res.sendFile(home)
            }else{
                res.redirect("/login")
            }
        })
       }else{
        sendFile(register)
       }
       
})

app.listen(process.env.PORT, ()=> {
    console.log(`server runing on ${process.env.PORT}`)
});