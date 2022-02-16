const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','') //Require the token send by header
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //Decode and verify if the token is valid and return token
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token}) //Retrieve the id from the token, and check if the token is available for the user
        
        if(!user){
             throw new Error()
        }
        
        req.token = token //return token
        req.user = user //return user from mongoose
        
        next()
    }catch(e){
        res.status(401).send({Error: 'Please authenticate!'})
    }
}

module.exports = auth