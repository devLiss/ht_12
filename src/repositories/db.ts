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
//export const client = new MongoClient(mongoURI);
/*export const blogCollection = client.db("ht_03").collection<blogType>("blogs");
export const postCollection = client.db("ht_03").collection<postType>("posts");
export const userCollection = client.db("ht_03").collection("users");
export const commentsCollection = client.db("ht_03").collection("comments");
export const sessionCollection = client.db("ht_03").collection("sessions");
export const requestCollection = client.db("ht_03").collection("requests");
export const tokensBlackListCollection = client.db("ht_03").collection("tokens");
export const likesCollection = client.db("ht_03").collection("likes");
*/
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

