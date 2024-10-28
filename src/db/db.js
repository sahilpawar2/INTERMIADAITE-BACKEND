import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const ConnectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n Connected to MongoDB: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED : ", error)
        process.exit(1)
    }
}

export default ConnectDb;
export { ConnectDb };


//mongoose.connect("url of the database", name of the database) it is the function
//connectionInstance.connection .host is the host of the database  to which your applivcation is to be connected
//process.exit(1) is used to exit the application if the connection fails
/*try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGOBD_URL}/${DB_NAME}`)
    console.log(`\n connected to mongoDB :${connectionInstance.connection.host}`)
}catch (error){
    console.log("failed to connect to the database", error)
    process.exit(1)
} */

