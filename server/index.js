require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 3333
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware)

const startApp = async () =>{
    try{
        await mongoose.connect(process.env.BD_URL)
        app.listen(PORT, () => console.log(`Сервер стартовал на ${PORT} порту`))
    }catch (e){
    console.log(e)
    }
}

mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - '));

startApp()
