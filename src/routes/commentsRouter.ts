import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {likeStatusValidation} from "../middlewares/middlewares";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comment-controller";

export const commentsRouter = Router({})
const commentsController = container.resolve(CommentsController)

commentsRouter.put('/:commentId/like-status',authMiddleware, likeStatusValidation, inputValidationMiddleware, commentsController.makeLike.bind(commentsController))
commentsRouter.get('/:id',commentsController.getComment.bind(commentsController))
commentsRouter.delete('/:commentId',authMiddleware, commentsController.deleteComment.bind(commentsController))
commentsRouter.put('/:commentId',authMiddleware,body('content').trim().isLength({min:20, max:300}),inputValidationMiddleware,commentsController.updateComment.bind(commentsController))