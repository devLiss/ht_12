import {PostRepo} from "../repositories/post-db-repo";
import {postType} from "../types";
import {injectable} from "inversify";

@injectable()
export class PostService{

    constructor(protected postRepo:PostRepo) {
    }
    async findAllPosts(pageNumber:number, pageSize:number, sortBy: any , sortDirection: any){
        return await this.postRepo.findAllPosts(pageNumber,pageSize, sortBy, sortDirection);
    }
    async findPostById(id:string){
        return this.postRepo.findPostById(id);
    }
    async deletePost(id:string){
        return this.postRepo.deletePost(id);
    }
    async createPost(title:string, shortDescription:string, content:string, blogId:string, blogName:string) {
        const post:postType = {
            title:title,
            shortDescription:shortDescription,
            content:content,
            blogId:blogId,
            blogName:blogName,
            createdAt:new Date().toISOString()
        }

        const createdPost = await this.postRepo.createPost(post);
        return createdPost;
    }
    async updatePost( id:string,
                      title: string,
                      shortDescription: string,
                      content: string,
                      blogId: string){
        return this.postRepo.updatePost(id,title,shortDescription,content,blogId)
    }
    async getPostsByBlogId(blogId:string,pageNumber:number, pageSize:number,sortBy:any,sortDirection:any){
        return this.postRepo.getPostsByBlogId(blogId,pageNumber, pageSize,sortBy,sortDirection);
    }
}