import {Router, Request, Response, NextFunction} from "express";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {authGuard} from "../middlewares/authGuard";
import {
    blogNameValidation,
    postBlogIdValidation, postContentValidation, postShortDescrValidation, postTitleValidation,
    searchNameTermValidator,
    urlValidation
} from "../middlewares/middlewares";
import {
    searchNameTermSanitizer,
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogs-controller";

const {body} = require('express-validator');

export const blogsRouter = Router({})

const blogsController = container.resolve(BlogsController)

blogsRouter.get('/', searchNameTermSanitizer, pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer, sortDirectionSanitizer, blogsController.getAllBlogs)
blogsRouter.get('/:id/posts', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer, sortDirectionSanitizer, blogsController.getPostsByBlogId)
blogsRouter.post('/', authGuard, blogNameValidation, urlValidation, inputValidationMiddleware, blogsController.createBlog)
blogsRouter.post('/:id/posts', authGuard, postTitleValidation, postShortDescrValidation, postContentValidation, inputValidationMiddleware, blogsController.createPostByBlogId)
blogsRouter.get('/:id', blogsController.getBlogById)
blogsRouter.put('/:id', authGuard, blogNameValidation, urlValidation, inputValidationMiddleware, blogsController.updateBlog)
blogsRouter.delete('/:id', authGuard, blogsController.deleteBlog)