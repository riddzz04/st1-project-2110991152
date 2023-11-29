//import express,pasth,bcrypt module
const express =require('express');
const pasth =require("path");
const bcrypt=require("bcrypt");
const collection=require("./config");

//create express application
const app= express();

//convert data into json format
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//use EJS as the view engine
app.set('view engine','ejs');

//static file
app.use(express.static("public"));

//use app.get method first parameter is root and second is call back function
//in callback we have 2 parameters - request and respond you can give any name to it
app.get("/",(req, res)=> {
    res.render("login");    //render login page
});

app.get("/signup", (req, res) => {
    res.render("signup");    // render signup page
});


//Register User
app.post("/signup", async (req, res) =>  {
    const data ={
        name: req.body.username,
        password: req.body.password
    }

    //check if the user already exists in the database
    const existingUser= await collection.findOne({name:data.name});
    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    }
    else{
        //hash the password using bcrypt 
        const saltRounds =10; //Number of salt round for bcrypt
        const hashesPassword= await bcrypt.hash(data.password, saltRounds);
        data.password=hashesPassword; //Replace the hash password with original password

        const userdata  =await collection.insertMany(data);
        console.log(userdata);
    }
});

//Login user
app.post("/login", async(req,res)=>{
    try{
        const check=await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user name cannot found");
        }
        //compare the hash password  from the database with  the plain text
        const isPasswordMatch=await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch)
        {
            res.render("home");
        }else{
            req.send("wrong password");
        }
    }
    catch{
        res.send("wrong  Details");
    }
})



//choose a port where you want to run your application
const port=5000;
app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`)
})