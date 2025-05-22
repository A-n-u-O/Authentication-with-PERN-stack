const express = require("express")
const cors =  require("cors")
const app = express();

//middleware
app.use(cors())
app.use(express.json())//req.body

//ROUTES//
app.use("/auth", require("./routes/jwtAuth"))

//register and login routes


app.listen(5000, ()=>{
    console.log("server started on port 5000");
})