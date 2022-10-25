import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    title:String,
    shortDescription:String,
    content:String,
    blogId:String,
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const PostsModel = mongoose.model('posts', postsSchema)