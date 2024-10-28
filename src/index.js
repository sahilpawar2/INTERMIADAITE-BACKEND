import dotenv from 'dotenv'
import {ConnectDb} from './db/db.js';   
import { app } from './app.js';

dotenv.config({
    path : './.env'
})

ConnectDb()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("YOUR SEVER IS RUNNIGN ON : " + process.env.PORT)
    })
})
.catch(
    (err) => {
        console.log("MONGODB CONNECTION FAILED : ", err)
    }
)
// const app = express();

// (async() => {
//     // Connect to the database
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error) =>{
//             console.log('ERROR:', error)
//             throw error
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`Your app is listenening on ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log('ERROR:', error)
//         throw error
//     }
// })()



/**connectDB().then(// take a callback () => {
 * app.listen(// port from env variable, callback() =>{
 * console.log("YOUR SEVER IS RUNNIGN ON : " + process.env.PORT)
 * })
}).catch(
    (err) => {
    console.log(err)
        }
)  */