const User = require("../model/user");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config({path:"../.env"})


exports.getUser = (req,res)=>{
    res.status(200).send({user:req.user})
}

exports.registerUser = async(req , res)=>{
    try {
        const {name , lastName , email , password} = req.body
        //check if empty fields
        // if(!name || !lastName || !email || !password){
        //     return res.status(400).json({msg:"please enter all fields"})
        // }
        //check if email is valid
        const checkEmailExist = await User.findOne({email:email});
        if(checkEmailExist){
            return res.status(400).json({msg:"email already exist"})
        }
        const user = new User({...req.body});
        //hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password , saltRounds);
        user.password = hashedPassword;
        await user.save()

        //sign User
        const payload={
            id:user._id
        }

        //Token
        const Token = await jwt.sign(payload,process.env.MySecret, { expiresIn: '2 days' })

        return res.status(201).json({msg:"user created",user , Token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Can Not Register"})
    }
}


exports.loginUser = async(req,res)=>{
    try {
        const {email , password} = req.body;
        //check email & pwd
        // if(!email || !password){
        //     return res.status(400).json({msg:"please enter all fields"})
        // }
        //check if User Exist
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({msg:"User Not Exist"})  
        }
        //check if password is correct
        const isMatch = await bcrypt.compare(password , user.password)
        // If not The same
        if(!isMatch){
            return res.status(400).json({msg:"Incorrect Password"})
        }

                //sign User
                const payload={
                    id:user._id
                }
        
                //Token
                const Token = await jwt.sign(payload,process.env.MySecret, { expiresIn: '2 days' })

        //if is match
        return res.status(200).json({msg:"Login Success",user , Token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Can Not Login"})
    }
}


