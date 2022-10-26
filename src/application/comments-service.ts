import {CommentRepo} from "../repositories/comment-db-repo";
import {ObjectId} from "mongodb";
import {LikesRepo} from "../repositories/likes-db-repo";
import {inject, injectable} from "inversify";
@injectable()
export class CommentsService{

    constructor(@inject(CommentRepo) protected commentRepo:CommentRepo,
                @inject(LikesRepo) protected likesDbRepo:LikesRepo) {
    }
    async createComment(content:string, postId:string, userId:string, userName:string){
        const newComment = {
            content:content,
            postId:postId,
            userId:userId,
            userLogin:userName,
            createdAt:new Date().toISOString()
        }

        const createdComment = await this.commentRepo.createComment(newComment)
        return createdComment

    }
    async getCommentByID(id:string, currentUserId:ObjectId){
        const comment = await this.commentRepo.getCommentById(id);
        if(comment){
            const likeInfo = await this.likesDbRepo.getLikesAndDislikesByCommentId(id)
            const likesCountObj = likeInfo.filter((info)=> {
                return info._id === 'Like'
            })
            const dislikesCountObj = likeInfo.filter((info)=> {
                return info._id === 'Dislike'
            })

            const myStatusInfo = await this.likesDbRepo.getLikeByCommentIdAndUserId(comment.id, currentUserId)

            comment.likesInfo = {
                "likesCount": likesCountObj.length ? likesCountObj[0].count : 0,
                "dislikesCount": dislikesCountObj.length ? dislikesCountObj[0].count : 0,
                "myStatus":myStatusInfo ? myStatusInfo.status : "None"
            }
        }
        return comment;
    }
    async deleteComment(id:string){
        return await this.commentRepo.deleteComment(id);
    }
    async updateComment(id:string,content:string){
        return await this.commentRepo.updateComment(id, content);
    }
    async getCommentsByPostId(userId:string, postId:string,pageNumber:number,pageSize:number, sortBy:any, sortDirection:any){
        return await this.commentRepo.getCommentsByPostId(userId, postId, pageNumber, pageSize, sortBy, sortDirection)
    }
    async makeLike(commentId:string, userId:ObjectId, status:string){
        const commentIdDb = new ObjectId(commentId)
        console.log("USERID")
        console.log(userId)
        const existedLike = await this.likesDbRepo.getLikeByCommentIdAndUserId(commentId,userId)
        const likeInfo:{commentId:ObjectId, userId:ObjectId, status:string} = {
            commentId:commentIdDb,
            userId,
            status
        }
        console.log(likeInfo)
        let like = null;
        if(existedLike){
            like = await this.likesDbRepo.updateLike(likeInfo)
        }
        else{
            like = await this.likesDbRepo.createLike(likeInfo);
        }
        return like;
    }
}
