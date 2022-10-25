import mongoose from "mongoose";

const likeInfoSchema = new mongoose.Schema({
    likesCount:  Number,
    dislikesCount: Number,
    myStatus: String,
},{_id:false, versionKey:false})
const commentsSchema = new mongoose.Schema({
    content:{type:String, required:true},
    postId:{type:mongoose.SchemaTypes.ObjectId, required:true},
    userId:{type:mongoose.SchemaTypes.ObjectId, required:true},
    userLogin:{type:String, required:true},
    createdAt:{type:Date, required:true},
    likesInfo:{type:likeInfoSchema}
},{
    versionKey: false // You should be aware of the outcome after set to false
})

commentsSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.postId
    return obj
}
export const CommentsModel = mongoose.model('comments', commentsSchema)