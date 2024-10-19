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
