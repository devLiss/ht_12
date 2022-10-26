import {ObjectId} from "mongodb";
import {LikesModel} from "../models/likes.model";
import {injectable} from "inversify";
@injectable()
export class LikesRepo{
    async createLike(like:{commentId:ObjectId, userId:ObjectId, status:string}){

        const createdLike = new LikesModel(like)
        createdLike.save()
        console.log(createdLike)
        return createdLike
        //return await LikesModel.insertOne(like);
    }
    async updateLike(like:{commentId:ObjectId, userId:ObjectId, status:string}){
        const existedLike = await LikesModel.findOne({commentId:like.commentId,userId:like.userId })
        if(!existedLike){
            return false
        }
        existedLike.status = like.status
        existedLike.save()
        return existedLike
        /*const updated = await likesCollection.findOneAndUpdate({commentId:like.commentId,userId:like.userId },{$set:{status:like.status}})
        return updated*/
    }
    async createPostLike(like:{postId:ObjectId, userId:ObjectId, login:string, addedAt:string, status:string}){

        const createdLike = new LikesModel(like)
        createdLike.save()
        console.log(createdLike)
        return createdLike
    }
    async updatePostLike(like:{postId:ObjectId, userId:ObjectId, login:string, addedAt:string, status:string}){
        const existedLike = await LikesModel.findOne({postId:like.postId,userId:like.userId })
        if(!existedLike){
            return false
        }
        existedLike.status = like.status
        existedLike.save()
        return existedLike
    }
    async getLikeByCommentIdAndUserId(commentId:string, userId:ObjectId){
        return await LikesModel.findOne({commentId:new ObjectId(commentId), userId:userId});
    }
    async getLikeByPostIdAndUserId(postId:string, userId:ObjectId){
        return await LikesModel.findOne({postId:new ObjectId(postId), userId:userId});
    }
    async getLikesAndDislikesByCommentId(commentId:string){
        const counts = await LikesModel.aggregate([
            {$match:{commentId:new ObjectId(commentId)}},
            {$group:{_id:"$status",count:{$sum:1}}}]
        )//.toArray();
        return counts;
    }
    async deleteAll(){
        await LikesModel.deleteMany({})
    }
}