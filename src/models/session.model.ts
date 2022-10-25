import mongoose from "mongoose";

const sessionScheme = new mongoose.Schema({
    deviceId:{type:String, required:true},
    expiredDate:{type:Date, required:true,default: Date.now},
    ip:{type:String, required:true},
    lastActiveDate:{type:Date, required:true,default: Date.now},
    title:{type:String, required:true},
    userId:{type:String, required:true},
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const SessionModel = mongoose.model('sessions', sessionScheme)