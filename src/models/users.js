const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('Users', {
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
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
})

module.exports = User