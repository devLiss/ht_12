import {PostRepo} from "../repositories/post-db-repo";
import {postType} from "../types";
import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {LikesRepo} from "../repositories/likes-db-repo";

@injectable()
export class PostService{

    constructor(@inject(PostRepo) protected postRepo:PostRepo,
                @inject(LikesRepo) protected likesDbRepo:LikesRepo) {
    }
    async findAllPosts(userId:ObjectId,pageNumber:number, pageSize:number, sortBy: any , sortDirection: any){
        return await this.postRepo.findAllPosts(userId, pageNumber,pageSize, sortBy, sortDirection);
    }
    async findPostById(id:string, userId:ObjectId){
        return this.postRepo.findPostById(id, userId);
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
    async getPostsByBlogId(userId:ObjectId, blogId:ObjectId,pageNumber:number, pageSize:number,sortBy:any,sortDirection:any){
        return this.postRepo.getPostsByBlogId(userId, blogId,pageNumber, pageSize,sortBy,sortDirection);
    }

    async makeLike(postId:string, userId:ObjectId, userLogin:string, status:string){
        console.log("Make like for post!")
        console.log(status)
        const postIdDb = new ObjectId(postId)
        console.log("USERID")
        console.log(userId)
        const addedAt = new Date().toISOString()
        const existedLike = await this.likesDbRepo.getLikeByPostIdAndUserId(postId,userId)
        const likeInfo:{postId:ObjectId, userId:ObjectId, login:string, addedAt: string,status:string} = {
            postId:postIdDb,
            userId,
            login:userLogin,
            addedAt,
            status,
        }
        console.log(likeInfo)
        let like = null;
        if(existedLike){
            like = await this.likesDbRepo.updatePostLike(likeInfo)
        }
        else{
            like = await this.likesDbRepo.createPostLike(likeInfo);
        }
        return like;
    }
}