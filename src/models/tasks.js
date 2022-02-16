const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, //Setting the type as an object ID
        required: true,
        ref: 'user'
    }
}, {
    timestamps: true
})

tasksSchema.pre('save', async function(next){

    next()
})

const Tasks = mongoose.model('Tasks', tasksSchema)

module.exports = Tasks