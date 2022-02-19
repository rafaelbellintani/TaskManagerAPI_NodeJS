const express = require('express')
const router = express.Router()
const multer = require('multer')
const User = require('../models/users')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account') 

const auth = require('../middlewares/auth')
const { Mongoose } = require('mongoose')
const sharp = require('sharp')

router.get('/users', auth, async (req,res)=>{
    res.status(200).send(req.user)
})

router.post('/users', async (req,res)=>{
    try{
        const user = await new User(req.body).save()
        sendWelcomeEmail(req.body.email, req.body.username)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res)=>{
    const postInfo = Object.keys(req.body)
    const allowedPostInfo = ['email','password']
    const isAllowed = postInfo.every((post)=>allowedPostInfo.includes(post))
    
    if(!isAllowed){
        res.status(400).send({ Error:"Only email and password are valids arguments!" })
    }
    
    try{ 
        const user = await User.findByCredentials(req.body.email,req.body.password) //Check if email and password is in database
        const token = await user.generateAuthToken() //Generate and save token to the user document db
        res.status(200).send({ user, token })
    }catch(e){
        res.status(404).send()
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        }) //In filter method, return only the elements satifying inside the new array
    
        await req.user.save()
    
        res.status(200).send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({Message:"All devices are disconnected successfuly!"})
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req,res)=>{
    const updates = Object.keys(req.user)
    const allowedUpdates = ['username','password','email']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({Error: "Invalid argument update!"})
    }
try{
    const user = req.user
    updates.forEach((update)=>user[update] = req.body[update])
    await user.save()

    res.status(201).send(user)
}catch(e){
    res.status(400).send(e)
    }
})

// router.patch('/users/:id', async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['username','password','email']
//     const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

// if(!isValidOperation){
//     return res.status(400).send({Error: "Invalid update!"})
// }

// try{

//     const user = await User.findByIdAndUpdate(req.params.id)
//     updates.forEach((update)=>user[update] = req.body[update])
//     await user.save()
    
//     if(!user){
//         return res.status(404).send({Error:"This ID was not found!"})
//     }
//     res.status(201).send(user)
// }catch(e){
//     res.status(400).send(e)
//     }
// })

router.delete('/users/me', auth, async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.username)
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb('Please upload a image!')
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).webp().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message })
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
    try{
        const avatar = req.user.avatar
    
        if(!avatar){
            return res.send(404).send({ Error: "No avatar has been found for this user to delete it!" })
        }

        req.user.avatar = undefined
        req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(400).send(e)
    } 
})

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/webp')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router