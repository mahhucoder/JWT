const express = require('express')
const app = express()
const port = 8000
const route = require('./routers/index')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/ManageStore',{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log('Connect successful')
})

app.use(cors({
    credentials:true,
    origin:['http://localhost:3000'],
}))

app.use(express.json())
app.use(express.urlencoded({ 
    extended:true
}))
app.use(cookieParser())

route(app)

app.listen(port)