import {injectable} from "inversify";
import {Request, Response} from "express";
import {CommentsService} from "../application/comments-service";
import {ObjectId} from "mongodb";
import {UserService} from "../application/user-service";
import {JwtService} from "../application/jwt-service";

@injectable()
export class CommentsController{

    constructor(protected commentsService:CommentsService,
                protected userService:UserService,
                protected jwtService:JwtService) {
    }

    async makeLike(req:Request, res:Response){//@ts-ignore
        console.log(req.user)
        //@ts-ignore
        const comment = await this.commentsService.getCommentByID(req.params.commentId, req.user!.id)
        if(!comment){
            res.sendStatus(404)
            return
        }
        //@ts-ignore
        const result = await commentsService.makeLike(req.params.commentId, req.user!.id!, req.body.likeStatus)
        res.sendStatus(204)}

    async getComment(req:Request, res:Response){let currentUserId = new ObjectId();
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const userId = await this.jwtService.getUserByAccessToken(token);
            console.log("UserId = " + userId)

            if(userId){
                const user = await this.userService.getUserById(userId.toString());
                if(user){currentUserId = user.id}
            }
        }
        const comment = await this.commentsService.getCommentByID(req.params.id,currentUserId)
        if(!comment){
            res.sendStatus(404)
            return
        }
        res.status(200).send(comment)
    }
    async deleteComment(req:Request, res:Response){
        //@ts-ignore
        const comment = await this.commentsService.getCommentByID(req.params.commentId, req.user.id);
        if(!comment){
            res.send(404)
            return
        }
        //@ts-ignore
        if(comment.userId.toString() !== req.user.userId.toString()){
            res.send(403)
            return
        }

        const isDeleted = await this.commentsService.deleteComment(comment.id)
        res.send(204)
    }

    async updateComment(req:Request, res:Response){//@ts-ignore
        const comment = await this.commentsService.getCommentByID(req.params.commentId, req.user.id);
        if(!comment){
            res.send(404)
            return
        }
        console.log(comment.userId)
        //@ts-ignore
        console.log(req.user.userId)
        //@ts-ignore
        if(comment.userId.toString() !== req.user.userId.toString()){
            res.send(403)
            return
        }

        const isModified = await this.commentsService.updateComment(comment.id, req.body.content)
        res.send(204)
    }
}