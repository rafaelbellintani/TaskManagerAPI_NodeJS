const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose.js')
const User = require('./models/users.js')
const Task = require('./models/tasks.js')
const e = require('express')

app.use(express.json())


//USERS
app.get('/users', (req,res)=>{
    User.find({}).then((response)=>{
        res.send(response)
    }).catch((error)=>{
        res.status(500).send()
    })
})

app.get('/users/:id', (req,res)=>{
    User.findById(req.params.id).then((response)=>{
        if(!response){
            return res.status(404)
        }
        res.send(response)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})

app.post('/users', (req,res)=>{
    const user = new User(req.body)
    user.save().then((response)=>{
        res.send(response)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})


//TASKS

app.get('/tasks', (req,res)=>{
    Task.find({}).then((response)=>{
        res.send(response)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})

app.get('/tasks/:id', (req,res)=>{
    Task.findById(req.params.id).then((response)=>{
        if(!response){
            return res.status(400)
        }
        res.send(response)
    }).then((error)=>{
        res.status(500).send(error)
    })
})

app.post('/tasks', (req,res)=>{
    const task = new Task(req.body)
    task.save().then((response)=>{
        res.send(response)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})


app.listen(port, ()=>{
    console.log("Connected successfuly at port " + port)
})