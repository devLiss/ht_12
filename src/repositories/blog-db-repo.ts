import {blogType} from "../types";
import {ObjectId} from "mongodb";
import {BlogsModel} from "../models/blogs.model";
import {injectable} from "inversify";

export interface blogsPaginator{
    pageCount:number,
    page:number,
    pageSize:number,
    totalCount:number,
    items:blogType[]
}
@injectable()
export class BlogsRepo{
    async findAllBlogs(searchNameTerm:any, pageNumber:number,pageSize:number, sortBy:string, sortDirection:any):Promise<{ pagesCount: number; pageSize: number; page: number; totalCount: number; items:any[]}>{

        console.log("seqarchNameTerm "+searchNameTerm);

        const blogs = await BlogsModel.find({"name":{$regex:searchNameTerm,$options : 'i' }})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )
        //.toArray();

        console.log(blogs);
        /*const temp = blogs.map((blog) => {
            // @ts-ignore
            blog.transform();
            return blog
        })*/
        const totalCount = await BlogsModel.count({"name":{$regex:searchNameTerm ,$options : 'i' }});

        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:blogs
        }
        return outputObj
    }

    async findBlogById(id:string):Promise<any>{
        const blog = await BlogsModel.findOne({_id:new ObjectId(id)});
        /*if(blog){
            //@ts-ignore
            delete Object.assign(blog, {["id"]: blog["_id"] })["_id"];
        }*/

        return blog
    }
    async createBlog(blog:blogType):Promise<blogType | null>{

        const createdBlog = await BlogsModel.create(blog);
        await createdBlog.save()
        // @ts-ignore
        //delete Object.assign(blog, {["id"]: blog["_id"] })["_id"];
        return createdBlog;
    }
    async deleteBlog(id:string):Promise<boolean>{
        const result = await BlogsModel.deleteOne({_id:new ObjectId(id)});
        return result.deletedCount === 1
    }
    async updateBlog(id:string, name:string, youtubeUrl:string ):Promise<boolean>{
        const blog = await BlogsModel.findOne({_id:new ObjectId(id)})
        if(!blog){
            return false
        }

        blog.name = name;
        blog.youtubeUrl = youtubeUrl
        blog.save();

        return true
    }
    async deleteAll():Promise<boolean>{
        const result = await BlogsModel.deleteMany({})
        return result.deletedCount ===1
    }
}