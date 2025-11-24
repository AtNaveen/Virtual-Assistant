const genToken = require("../config/token.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");

exports.signUp = async(req,res) => {
    try {
    
        const {name,email,password} = req.body;
        
        if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

        const exist = await userModel.findOne({email});
        
        if(exist) {
        return res.json({status:404 ,msg:"User already exists in this email"})
      }     

      const hashpass = bcrypt.hashSync(password,10)

      const user =await userModel.create ({
        name,
        email,
        password:hashpass
     } )

     const token = await genToken(user._id);

     res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:true
     })

     return res.status(201).json(user);

    } catch (error) {
        console.log(error);
        res.json({status:504 ,msg:error.message})
    }
}

exports.Login = async(req,res) => {
    try {
    
        const {email,password} = req.body;

        const user = await userModel.findOne({email});
        
        if(!user) {
        return res.json({status:404 ,msg:"User didn't exists Please Register"})
      }

      const compare = bcrypt.compareSync(password,user.password)
        
        if(!compare){
        return res.status(404).json({message:"Invalid Password"})
    }
     

     const token = await genToken(user._id);

     res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:true
     })

     return res.status(200).json({msg:"Login successfully"});

    } catch (error) {
        console.log(error);
        res.json({status:504 ,msg:error.message})
    }
}

exports.LogOut = async(req,res) => {

    try {
    
     res.clearCookie("token")
     return res.status(200).json({msg:"Logout successfully"});

    } catch (error) {
        console.log(error);
        res.json({status:504 ,msg:error.message})
    }
}


