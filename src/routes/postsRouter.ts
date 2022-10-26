import {Router} from "express";
import {authGuard} from "../middlewares/authGuard";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {
    likeStatusValidation,
    postBlogIdValidation,
    postContentValidation,
    postShortDescrValidation,
    postTitleValidation
} from "../middlewares/middlewares";
import {
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware";
import {container} from "../composition-root";
import {PostController} from "../controllers/post-controller";


export const postsRouter = Router({})
const postController = container.resolve(PostController)

postsRouter.get('/', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getPosts.bind(postController))
postsRouter.post('/', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware, postController.createPost.bind(postController))
postsRouter.get('/:id', postController.getPostById.bind(postController))
postsRouter.put('/:id', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware,postController.updatePost.bind(postController))
postsRouter.delete('/:id', authGuard,postController.deletePost.bind(postController))
postsRouter.get('/:postId/comments', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getCommentsByPostId.bind(postController))
postsRouter.post('/:postId/comments',authMiddleware,body('content').trim().isLength({min:20, max:300}),inputValidationMiddleware, postController.createComment.bind(postController))
postsRouter.put('/:postId/like-status',authMiddleware, likeStatusValidation, inputValidationMiddleware, postController.makeLike.bind(postController))
