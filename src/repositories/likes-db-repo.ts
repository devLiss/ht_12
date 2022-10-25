import {ObjectId} from "mongodb";
import {LikesModel} from "../models/likes.model";

class LikesRepo{
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
    async getLikeByCommentIdAndUserId(commentId:string, userId:ObjectId){
        return await LikesModel.findOne({commentId:new ObjectId(commentId), userId:userId});
    }
    async getLikesAndDislikesByCommentId(commentId:string){
        const counts = await LikesModel.aggregate([
            {$match:{commentId:new ObjectId(commentId)}},
            {$group:{_id:"$status",count:{$sum:1}}}]
        )//.toArray();
        return counts;
    }
}

export const likesDbRepo = new LikesRepo()