import mongoose from "mongoose";

const likesScheme = new mongoose.Schema({
    commentId:mongoose.SchemaTypes.ObjectId,
    status:String,
    userId:mongoose.SchemaTypes.ObjectId
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const LikesModel = mongoose.model('likes', likesScheme)