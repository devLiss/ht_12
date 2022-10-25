import mongoose from "mongoose";

const requestScheme = new mongoose.Schema({
    ip:String,
    requestDate:Date,
    url:String
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const RequestModel = mongoose.model('requests', requestScheme)