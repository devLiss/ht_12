import {Router} from "express";
import {authGuard} from "../middlewares/authGuard";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {
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

postsRouter.get('/', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getPosts)
postsRouter.post('/', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware, postController.createPost)
postsRouter.get('/:id', postController.getPostById)
postsRouter.put('/:id', authGuard, postTitleValidation,postShortDescrValidation, postContentValidation, postBlogIdValidation,inputValidationMiddleware,postController.updatePost)
postsRouter.delete('/:id', authGuard,postController.deletePost)
postsRouter.get('/:postId/comments', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, postController.getCommentsByPostId)
postsRouter.post('/:postId/comments',authMiddleware,body('content').trim().isLength({min:20, max:300}),inputValidationMiddleware, postController.createComment)