
import {ObjectId} from "mongodb";
import {CommentsModel} from "../models/comments.model";

class CommentRepo{
    async createComment(comment:any){

        const createdComment = new CommentsModel(comment)
        await createdComment.save()

        createdComment.likesInfo = {
            likesCount:  0,
            dislikesCount: 0,
            myStatus: "None"
        }

        return createdComment.toJSON();
    }

    async getCommentById(id:string){
        return CommentsModel.findById(id);
    }
    async deleteComment(id:string){
        const result = await CommentsModel.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    }
    async updateComment(id:string, content:string){
        const comment = await CommentsModel.findOne({_id:new ObjectId(id)});
        if(!comment){
            return false
        }

        comment.content = content
        comment.save();
        //const result = await commentsCollection.updateOne({_id:new ObjectId(id)},{$set:{content:content}})
        //return result.matchedCount === 1
        return true
    }
    async getCommentsByPostId(userId:string,postId:string,pageNumber:number,pageSize:number, sortBy:string, sortDirection:any){
        /*const comments = await commentsCollection.find({postId:new ObjectId(postId)},
            {projection:{_id:0,
                id:"$_id",
                content:1,
                userId:1,
                userLogin:1,
                createdAt:1}})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )
            .toArray();*/

        const comments = await CommentsModel.aggregate([{$match:{"postId":new ObjectId(postId)}},{
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "commentId",
                pipeline: [{
                    $match: {
                        "status": "Like"
                    },
                },
                    {
                        $count: "count"
                    }
                ],
                as: "likesCount"
            }
        },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "commentId",
                    pipeline: [{
                        $match: {
                            "status": "Dislike"
                        },
                    },
                        {
                            $count: "count"
                        }
                    ],
                    as: "dislikesCount"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "commentId",
                    pipeline: [{
                        $match:{"userId":new ObjectId(userId)}
                    },{
                        $project:{_id:0,"status":1}
                    }],
                    as: "myStatus"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    content: 1,
                    userId: 1,
                    userLogin: 1,
                    createdAt: 1,
                    "likesInfo.likesCount": "$likesCount",
                    "likesInfo.dislikesCount": "$dislikesCount",
                    "likesInfo.myStatus":"$myStatus"
                }
            }])
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection})
        const temp = comments.map((comment) => {
            const likesCountArr = comment.likesInfo.likesCount
            const dislikesCountArr = comment.likesInfo.dislikesCount
            const myStatusArr = comment.likesInfo.myStatus

            const likesInfo = {
                likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
                dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
                myStatus: myStatusArr.length ? myStatusArr[0].status : "None"
            }
            comment.likesInfo = likesInfo
            return comment
        });
        console.log(temp)

        const totalCount = await CommentsModel.countDocuments({postId:new ObjectId(postId)});

        return {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:comments
        }
    }
    async deleteAll():Promise<boolean>{
        const result = await CommentsModel.deleteMany({})
        return result.deletedCount > 1
    }
}
export const commentRepo = new CommentRepo()