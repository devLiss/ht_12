import mongoose from "mongoose";

const blogsScheme = new mongoose.Schema({
    name:String,
    youtubeUrl:String,
    createdAd:String
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const BlogsModel = mongoose.model('blogs', blogsScheme)