//import {MongoClient} from 'mongodb'
import * as mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.mongoURI || "mongodb://localhost:27017";
const dbName = process.env.mongoDBName || ""

mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id;
    }
});
export async function runDB(){
    try {
        await mongoose.connect(mongoURI)
        console.log("CONNECT")
    }
    catch{
        console.log("DISCONNECT")
        await mongoose.disconnect()
    }
}

