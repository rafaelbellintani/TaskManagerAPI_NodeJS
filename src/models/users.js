const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const task = require('../models/tasks')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        validate(value){
            if(value === 'password'){
                throw new Error('Password cannot contain \"Password\"')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

//Methods is used in documents, down below we are editing and retrieve information from documents and remove what we dont want to show
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () { //this bind only works without array functions
    const token = jwt.sign({ '_id': this._id.toString() }, process.env.JWT_TOKEN) //Create a jsonwebtoken with the payload ID, and define 'thisismynewcourse' as password for sign
    this.tokens = this.tokens.concat({ token }) //in concat different of push, creates a new array with new element, in push elements are added in the existing array
    this.save()

    return token
}

//Static is used in SCHEMA, Down below there's no document, the static is for searching a document
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login!')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login!')
    }

    return user
} 

//Execute always when receive a return from mongodb queries
userSchema.pre('save', async function(next) {
   const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

userSchema.pre('remove', async function(next) {

    await task.deleteMany({'owner':this._id})
    next()
    
})

const User = mongoose.model('user', userSchema)

module.exports = User