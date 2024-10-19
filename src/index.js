import dotenv from 'dotenv'
import {ConnectDb} from './db/db.js';

dotenv.config({
    path : './env'
})

ConnectDb()
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