import {Router, Request, Response, NextFunction} from "express";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {authGuard} from "../middlewares/authGuard";
import {
    blogNameValidation,
    postBlogIdValidation, postContentValidation, postShortDescrValidation, postTitleValidation,
    searchNameTermValidator,
    urlValidation
} from "../middlewares/middlewares";
import {blogsService} from "../application/blogs-service";
import {searchNameTermSanitizer,
    pageNumberSanitizer,
    pageSizeSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";
import {postService} from "../application/post-service";
const { body} = require('express-validator');

export const blogsRouter = Router({})

class BlogsController{
    async getAllBlogs(req: Request, res: Response){
        console.log("get blogs PN "+req.query.pageNumber)
        console.log("get blogs PS "+req.query.pageSize)

        const data = await blogsService.findAllBlogs(req.query.searchNameTerm!, +req.query.pageNumber!, +req.query.pageSize!,req.query.sortBy,req.query.sortDirection);
        res.status(200).send(data);
    }
    async getPostsByBlogId(req: Request, res: Response){
        const blog = await blogsService.findBlogById(req.params.id);
        console.log(blog);
        if(!blog){
            res.send(404)
            return
        }
        const posts = await postService.getPostsByBlogId(req.params.id,+req.query.pageNumber!, +req.query.pageSize!,req.query.sortBy!,req.query.sortDirection)
        res.status(200).send(posts);
    }
    async getBlogById(req: Request, res: Response){
        const blog = await blogsService.findBlogById(req.params.id);
        blog ? res.status(200).send(blog) : res.send(404);}
    async createBlog(req: Request, res: Response){
        const blog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(blog)
    }
    async createPostByBlogId(req: Request, res: Response){
        const blog = await blogsService.findBlogById(req.params.id);
        console.log(blog);
        if(!blog){
            res.send(404)
            return
        }
        const post = await postService.createPost(req.body.title, req.body.shortDescription, req.body.content, blog!.id!, blog.name)
        res.status(201).send(post)}
    async updateBlog(req: Request, res: Response){
        const isUpdated = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
        isUpdated ? res.send(204) : res.send(404)
    }
    async deleteBlog(req: Request, res: Response){
        const isDeleted = await blogsService.deleteBlog(req.params.id)
        isDeleted ? res.send(204) : res.send(404)
    }
}

const blogsController = new BlogsController()

blogsRouter.get('/',searchNameTermSanitizer,pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer, blogsController.getAllBlogs)
blogsRouter.get('/:id/posts',pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer,blogsController.getPostsByBlogId)
blogsRouter.post('/',authGuard,blogNameValidation,urlValidation,inputValidationMiddleware,blogsController.createBlog)
blogsRouter.post('/:id/posts',authGuard,postTitleValidation,postShortDescrValidation, postContentValidation,inputValidationMiddleware,blogsController.createPostByBlogId)
blogsRouter.get('/:id',blogsController.getBlogById)

blogsRouter.put('/:id',authGuard,blogNameValidation,urlValidation,inputValidationMiddleware,blogsController.updateBlog)
blogsRouter.delete('/:id',authGuard,blogsController.deleteBlog)