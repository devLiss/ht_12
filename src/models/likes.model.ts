import mongoose from "mongoose";

const likesScheme = new mongoose.Schema({
    commentId:mongoose.SchemaTypes.ObjectId,
    postId:mongoose.SchemaTypes.ObjectId,
    addedAt:{type:String},
    userId:mongoose.SchemaTypes.ObjectId,
    login:{type:String},
    status:{type:String,required:true}

},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const LikesModel = mongoose.model('likes', likesScheme)