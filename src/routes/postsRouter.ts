import {Request, Response, Router} from "express";
import {authGuard} from "../middlewares/authGuard";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {
    postBlogIdValidation,
    postContentValidation,
    postShortDescrValidation,
    postTitleValidation
} from "../middlewares/middlewares";
import {postService} from "../application/post-service";
import {
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";
import {body} from "express-validator";
import {commentsService} from "../application/comments-service";
import {authMiddleware} from "../middlewares/authMiddleware";
import {jwtService} from "../application/jwt-service";
import {userService} from "../application/user-service";
import {ObjectId} from "mongodb";

export const postsRouter = Router({})

class PostController{
    async getPosts(req: Request, res: Response){
        console.log(req.query)
        const data = await postService.findAllPosts(+req.query.pageNumber!, +req.query.pageSize!,req.query.sortBy,req.query.sortDirection);
        res.status(200).send(data);
    }
    async createPost(req: Request, res: Response){
        const post = await postService.createPost(req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId,
            req.body.blogId);
        post ? res.status(201).send(post) : res.send(404)
    }
    async getPostById(req: Request, res: Response){
        const post = await postService.findPostById(req.params.id);
        post ? res.status(200).send(post) : res.send(404)
    }
    async updatePost(req: Request, res: Response){
        const isUpdated = await postService.updatePost(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId)

        isUpdated ? res.send(204) : res.send(404)}
    async deletePost(req: Request, res: Response){
        const isDeleted = await postService.deletePost(req.params.id);
        isDeleted ? res.send(204) : res.send(404);
    }
    async getCommentsByPostId(req: Request, res: Response){
        const post  = await postService.findPostById(req.params.postId);
        if(!post){
            res.send(404)
            return
        }

        let currentUserId = null;
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            const userId = await jwtService.getUserByAccessToken(token);
            console.log("UserId = " + userId)

            if(userId){
                const user = await userService.getUserById(userId.toString());
                if(user){currentUserId = user.id}
            }
        }

        const comments =  await commentsService.getCommentsByPostId(currentUserId,req.params.postId,+req.query.pageNumber!, +req.query.pageSize!,req.query.sortBy,req.query.sortDirection);
        res.status(200).send(comments)
    }
    async createComment(req: Request, res: Response){
        const post = await postService.findPostById(req.params.postId);
        console.log(post)
        if(!post){
            res.send(404)
            return
        }
        //@ts-ignore
        const comment = await commentsService.createComment(req.body.content, post!.id, req.user.id, req.user.login)
        res.status(201).send(comment)}
}

const postController = new PostController()

postsRouter.get('/', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getPosts)
postsRouter.post('/', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware, postController.createPost)
postsRouter.get('/:id', postController.getPostById)
postsRouter.put('/:id', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware,postController.updatePost)
postsRouter.delete('/:id', authGuard,postController.deletePost)
postsRouter.get('/:postId/comments', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getCommentsByPostId)
postsRouter.post('/:postId/comments',authMiddleware,body('content').trim().isLength({min:20, max:300}),inputValidationMiddleware, postController.createComment)