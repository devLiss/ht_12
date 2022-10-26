import {Request, Response} from "express";
import {UserService} from "../application/user-service";
import {CommentsService} from "../application/comments-service";
import {injectable} from "inversify";
import {JwtService} from "../application/jwt-service";
import {PostService} from "../application/post-service";
import {ObjectId} from "mongodb";

@injectable()
export class PostController {

    constructor(protected postService: PostService,
                protected jwtService: JwtService,
                protected userService: UserService,
                protected commentsService: CommentsService) {
    }

    async getPosts(req: Request, res: Response) {
        console.log(req.query)
        let currentUserId = new ObjectId();
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
        const data = await this.postService.findAllPosts(currentUserId,+req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection);
        res.status(200).send(data);
    }

    async createPost(req: Request, res: Response) {
        const post = await this.postService.createPost(req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId,
            req.body.blogId);
        post ? res.status(201).send(post) : res.send(404)
    }

    async getPostById(req: Request, res: Response) {
        let currentUserId = new ObjectId();
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
        const post = await this.postService.findPostById(req.params.id,currentUserId);
        post ? res.status(200).send(post) : res.send(404)
    }

    async updatePost(req: Request, res: Response) {
        const isUpdated = await this.postService.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)

        isUpdated ? res.send(204) : res.send(404)
    }

    async deletePost(req: Request, res: Response) {
        const isDeleted = await this.postService.deletePost(req.params.id);
        isDeleted ? res.send(204) : res.send(404);
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const post = await this.postService.findPostById(req.params.postId,new ObjectId());
        if (!post) {
            res.send(404)
            return
        }

        let currentUserId = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const userId = await this.jwtService.getUserByAccessToken(token);
            console.log("UserId = " + userId)

            if (userId) {
                const user = await this.userService.getUserById(userId.toString());
                if (user) {
                    currentUserId = user.id
                }
            }
        }

        const comments = await this.commentsService.getCommentsByPostId(currentUserId, req.params.postId, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection);
        res.status(200).send(comments)
    }

    async createComment(req: Request, res: Response) {
        //@ts-ignore
        const post = await this.postService.findPostById(req.params.postId, req.user.id);
        console.log(post)
        if (!post) {
            res.send(404)
            return
        }
        //@ts-ignore
        const comment = await this.commentsService.createComment(req.body.content, post!.id, req.user.id, req.user.login)
        res.status(201).send(comment)
    }

    async makeLike(req: Request, res: Response){

        //@ts-ignore
        const post = await this.postService.findPostById(req.params.postId, req.user._id)
        if(!post){
            res.sendStatus(404)
            return
        }

        console.log(req.body)
        //@ts-ignore
        await this.postService.makeLike(req.params.postId, req.user._id, req.user.login, req.body.likeStatus)
        res.sendStatus(204)
    }
}