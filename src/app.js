import express, { urlencoded } from 'express'
import cors from 'cors'     //npm i cors
import cookieParser from 'cookie-parser' //npm i cookie-parser

const app = express()    // holds all the express powers

app.use(cors({
    origin : process.env.CORS_ORIGIN,  //origin of the allowed port
    credentials : true    // cokkies that are allowed
}))
app.use(express.json({limit :"16kb"}))   // limit on how much json data size is allowed
app.use(urlencoded({extended: true, limit: "16kb"}))   // allow to encode the urls

app.use(express.static('public'))  // allow to store the files and pdf to the public folder
app.use(cookieParser())

export {app}