import {postType} from "../types";
import {ObjectId} from "mongodb";
import {PostsModel} from "../models/posts.model";

class PostRepo{
    async findAllPosts(pageNumber:number,pageSize:number, sortBy:string, sortDirection:any){
        console.log("PN "+pageNumber)
        console.log("PS " + pageSize)

        const posts = await PostsModel.find({}).skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )
            .lean()
        const temp = posts.map((post) => {
            //@ts-ignore
            //delete Object.assign(post, {["id"]: post["_id"] })["_id"];
            return post
        })
        const totalCount = await PostsModel.countDocuments();
        console.log(pageSize)
        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:temp
        }
        return outputObj

    }
    async findPostById(id:string|null){
        if(!id){
            return null
        }
        const post =  await PostsModel.findOne({_id:new ObjectId(id)})
        /*if(post){
            //@ts-ignore
            delete Object.assign(post, {["id"]: post["_id"] })["_id"];
        }*/
        return post
    }
    async deletePost(id:string){
        const result = await PostsModel.deleteOne({_id:new ObjectId(id)});
        return result.deletedCount === 1
    }
    async createPost(post:postType){
        const createdPost = new PostsModel(post)
        createdPost.save();
        /*await postCollection.insertOne(post);
        // @ts-ignore
        delete Object.assign(post, {["id"]: post["_id"] })["_id"];*/
        return createdPost
    }
    async updatePost( id:string,
                      title: string,
                      shortDescription: string,
                      content: string,
                      blogId: string){

        const post = await PostsModel.findOne({_id:new ObjectId(id)})
        if(!post){
            return false
        }
        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId

        post.save();
        /*const result = await postCollection.updateOne({_id:new ObjectId(id)},{$set:{
                title:title,
                shortDescription:shortDescription,
                content:content,
                blogId:blogId
            }})*/
        return true//result.matchedCount === 1
    }

    async getPostsByBlogId(blogId:string,pageNumber:number, pageSize:number,sortBy:string,sortDirection:any){

        console.log(blogId)
        //@ts-ignore
        const posts = await PostsModel.find({ blogId:new ObjectId(blogId) })
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )
            .lean()//.toArray();

        console.log(posts)
        const temp = posts.map((post:any) => {
            //@ts-ignore
            //delete Object.assign(post, {["id"]: post["_id"] })["_id"];
            return post
        })
        //@ts-ignore
        const totalCount:number = await PostsModel.count({blogId:new ObjectId(blogId)});

        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:temp
        }
        return outputObj
    }
    async deleteAll():Promise<boolean>{
        const result = await PostsModel.deleteMany({})
        return result.deletedCount === 1
    }
}
export const postRepo = new PostRepo()