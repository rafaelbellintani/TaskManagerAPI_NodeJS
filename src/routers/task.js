const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Task = require('../models/tasks')

// GET /tasks?completed=true
// GET /tasks?limit=3&skip=3
// GET /tasks?sortedBy=createdAt_desc
router.get('/tasks', auth, async (req,res)=>{
    try{

        const match = {}
        const sort = {}

        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split('_')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path:"tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }) //According the reference 'REF': in tasks model, this populate the virtual on users model according the arguments passed

        res.status(200).send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    try{
        const task = await Task.findOne({'_id':req.params.id, 'owner':req.user._id})

        if(!task){
            return res.status(404).send({"Error":"Task not found"})
        }
        
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/tasks', auth, async (req,res)=>{
    try{
        //const newTask = await new Task(req.body).save()

        const newTask = await new Task({
            ...req.body,
            'owner': req.user._id
        }).save()

        res.status(201).send(newTask)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description','completed']
    const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({Error:"Invalid update!"})
    }

    try{
        const task = await Task.findOne({'_id': req.params.id, 'owner': req.user._id})
       
        if(!task){
            return res.status(404).send({Error:"Task not found!"})
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        

        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
 try{
    const task = await Task.findOneAndDelete({'_id': req.params.id, 'owner': req.user._id})

    if(!task){
        return res.status(404).send({Error:"Task not found!"})
    }

    res.status(200).send(task)
 }catch(e){
    res.status(500).send(e)
 }
})

module.exports = router