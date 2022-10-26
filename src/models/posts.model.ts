import mongoose from "mongoose";

const extendedLikesInfo = new mongoose.Schema({
    "likesCount": Number,
    "dislikesCount": Number,
    "myStatus": String,
    "newestLikes": [
        {
            "addedAt": String,
            "userId": String,
            "login": String
        }
    ]
},{_id:false, versionKey:false})
const postsSchema = new mongoose.Schema({
    title:String,
    shortDescription:String,
    content:String,
    blogName:String,
    blogId:String,
    createdAt:String,
    extendedLikesInfo:{type:extendedLikesInfo}
},{
    versionKey: false
})
export const PostsModel = mongoose.model('posts', postsSchema)