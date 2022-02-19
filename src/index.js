const app = require("./app")
const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Connected successfuly at port " + port)
})