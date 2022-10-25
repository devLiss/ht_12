import {Request, Response} from "express";
import {BlogsService} from "../application/blogs-service";
import {PostService} from "../application/post-service";
import {injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        protected postService: PostService) {
    }

    async getAllBlogs(req: Request, res: Response) {
        console.log("get blogs PN " + req.query.pageNumber)
        console.log("get blogs PS " + req.query.pageSize)

        const data = await this.blogsService.findAllBlogs(req.query.searchNameTerm!, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection);
        res.status(200).send(data);
    }

    async getPostsByBlogId(req: Request, res: Response) {
        const blog = await this.blogsService.findBlogById(req.params.id);
        console.log(blog);
        if (!blog) {
            res.send(404)
            return
        }
        const posts = await this.postService.getPostsByBlogId(req.params.id, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy!, req.query.sortDirection)
        res.status(200).send(posts);
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogsService.findBlogById(req.params.id);
        blog ? res.status(200).send(blog) : res.send(404);
    }

    async createBlog(req: Request, res: Response) {
        const blog = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(blog)
    }

    async createPostByBlogId(req: Request, res: Response) {
        const blog = await this.blogsService.findBlogById(req.params.id);
        console.log(blog);
        if (!blog) {
            res.send(404)
            return
        }
        const post = await this.postService.createPost(req.body.title, req.body.shortDescription, req.body.content, blog!.id!, blog.name)
        res.status(201).send(post)
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdated = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
        isUpdated ? res.send(204) : res.send(404)
    }

    async deleteBlog(req: Request, res: Response) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id)
        isDeleted ? res.send(204) : res.send(404)
    }
}