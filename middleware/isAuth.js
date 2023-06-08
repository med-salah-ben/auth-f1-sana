var jwt = require('jsonwebtoken');
require("dotenv").config({path:"../.env"});
const User = require("../model/user");

const isAuth =async(req,res,next)=>{
    try {
        //get token
        const token = req.headers["x-auth-token"];
        //check for token
        if(!token){
            return res.status(400).send({msg:"no token unauthorized!"});
        }
        //if token => decode token with token from req.headers & my secret Key 
        const decoded = await jwt.verify(token,process.env.MySecret)
        //Get User By ID from Object payload and get Id => payload.id
        const user = await User.findById(decoded.id);
        //if we can't find user in the database => client error not valid
        if(!user){
            return res.status(400).send({msg:"Token is not valid!"})
        }
        //if user with the decoded.id exist in the database =>
        // req = {body:{},params:"",headears:[x-auth-token], user:{name:"amin",lastName:"test",email:"amin@gmail.com" , password:"1zdazfkezdz@"}} 
        //req.user = user
        //req={user:user}
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).send({msg:"token not valid!!!!"})
    }
}

module.exports = isAuth