const { MongoClient, ObjectId} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("Error to connect to the database!")
    }
    console.log("Connected with success!")

    const db = client.db(databaseName)

    // db.collection('tasks').deleteOne({'_id':new ObjectId('62046626b77f9d1c5b6eaa3d')}).then((response)=>{
    //     console.log("Document has been deleted with success!")
    // }).catch((err)=>{
    //     console.log("It's not possible delete this document!")
    // })

    // db.collection('tasks').updateMany({'title':'Goes to supermarket'},{
    //     $set:{
    //         completed: false
    //     } 
    // }).then((response)=>{
    //     console.log("Edit has been made successfuly!\n", response)
    // }).catch((error)=>{
    //     console.log("Sorry, cannot edit this document!")
    // })

    // db.collection('tasks').findOne({'_id':new ObjectID('620450b30c6322994885a348')}, (err,response)=>{
    //     if(err){
    //         return console.log(err)
    //     }
    //     console.log(response)  
    // })

    // db.collection('tasks').find({'completed':false}).toArray((err,response)=>{
    //     if(err){
    //         return console.log("An error occured to retrieve data.")
    //     }

    //     console.log(response)
    // })  

    // db.collection('tasks').updateOne({'_id':new ObjectId('62046626b77f9d1c5b6eaa3e')},{
    //     $set: {
    //         title: 'Clean house',
    //         description: 'Make a nice clean in the house'
    //     }
    // }).then((response)=>{
    //     console.log("Edit has been made successfuly!")
    // }).catch((err)=>{
    //     console.log("Sorry, cannot edit this document!")
    // })

    // db.collection('tasks').insertMany([{
    //     title: "COVID-19 Vaccine",
    //     description: "Remember to takes COVID-19 vaccine",
    //     completed: true
    // },
    // {
    //     title: "Goes to supermarket",
    //     description: "Remember to goes to the supermarket",
    //     completed: true
    // },
    // {
    //     title: "Dog bath",
    //     description: "Do the dogs bath",
    //     completed: false
    // }], (err, response)=>{
    //     if(err){
    //         return console.log("There's an error on save collections!")
    //     }

    //     console.log("Successfully saved!")
    // })

})

