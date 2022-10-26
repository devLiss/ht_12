import {postType} from "../types";
import {ObjectId} from "mongodb";
import {PostsModel} from "../models/posts.model";
import {injectable} from "inversify";
@injectable()
export class PostRepo{
    async findAllPosts(userId:ObjectId, pageNumber:number ,pageSize:number, sortBy:string, sortDirection:any){
        console.log("PN "+pageNumber)
        console.log("PS " + pageSize)

       const posts = await PostsModel.aggregate([{
           $lookup: {
               from: "likes",
               localField: "_id",
               foreignField: "postId",
               pipeline: [{
                   $match: {
                       "status": "Like"
                   },
               },
                   {
                       $count: "count"
                   }
               ],
               as: "likesCount"
           }
       },
           {
               $lookup: {
                   from: "likes",
                   localField: "_id",
                   foreignField: "postId",
                   pipeline: [{
                       $match: {
                           "status": "Dislike"
                       },
                   },
                       {
                           $count: "count"
                       }
                   ],
                   as: "dislikesCount"
               }
           }, {
               $lookup: {
                   from: "likes",
                   localField: "_id",
                   foreignField: "postId",
                   pipeline: [{
                       $match: { "userId": userId }
                   }, {
                       $project: { _id: 0, "status": 1 }
                   }],
                   as: "myStatus"
               }
           }, {
               $lookup: {
                   from: "likes",
                   localField: "_id",
                   foreignField: "postId",
                   pipeline: [{
                       $match: {
                           "status": "Like"
                       },
                   },{
                       $sort: {
                           _id: 1
                       },
                   },{
                       $limit: 3
                   },{
                       $project:{
                           addedAt:1,
                           login:1,
                           userId:1,
                           _id:0
                       }
                   }],
                   as: "newestLikes"
               }
           },
           {
               $project:{
                       _id: 0,
                       id: "$_id",
                       "title": 1,
                       "shortDescription": 1,
                       "content": 1,
                       "blogId": 1,
                       "blogName":1,
                       "createdAt": 1,
                       "extendedLikesInfo.likesCount": "$likesCount",
                       "extendedLikesInfo.dislikesCount": "$dislikesCount",
                       "extendedLikesInfo.myStatus":"$myStatus",
                        "extendedLikesInfo.newestLikes":"$newestLikes"
                   }
           }])
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )

        const totalCount = await PostsModel.countDocuments();

        const temp = posts.map((post) => {
            const likesCountArr = post.extendedLikesInfo.likesCount
            const dislikesCountArr = post.extendedLikesInfo.dislikesCount
            const myStatusArr = post.extendedLikesInfo.myStatus

            const extendedLikesInfo = {
                likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
                dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
                myStatus: myStatusArr.length ? myStatusArr[0].status : "None",
                newestLikes:post.extendedLikesInfo.newestLikes
            }
            post.extendedLikesInfo = extendedLikesInfo
            return post
        });

        console.log(pageSize)
        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:posts
        }
        return outputObj

    }
    async findPostById(id:string|null, userId:ObjectId){
        if(!id){
            return null
        }
        const post =  await PostsModel.aggregate([{$match:{_id:new ObjectId(id)}},{
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "postId",
                pipeline: [{
                    $match: {
                        "status": "Like"
                    },
                },
                    {
                        $count: "count"
                    }
                ],
                as: "likesCount"
            }
        },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: {
                            "status": "Dislike"
                        },
                    },
                        {
                            $count: "count"
                        }
                    ],
                    as: "dislikesCount"
                }
            }, {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: { "userId": userId }
                    }, {
                        $project: { _id: 0, "status": 1 }
                    }],
                    as: "myStatus"
                }
            }, {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: {
                            "status": "Like"
                        },
                    },{
                        $sort: {
                            _id: 1
                        },
                    },{
                        $limit: 3
                    },{
                        $project:{
                            addedAt:1,
                            login:1,
                            userId:1,
                            _id:0
                        }
                    }],
                    as: "newestLikes"
                }
            },
            {
                $project:{
                    _id: 0,
                    id: "$_id",
                    "title": 1,
                    "shortDescription": 1,
                    "content": 1,
                    "blogId": 1,
                    "blogName":1,
                    "createdAt": 1,
                    "extendedLikesInfo.likesCount": "$likesCount",
                    "extendedLikesInfo.dislikesCount": "$dislikesCount",
                    "extendedLikesInfo.myStatus":"$myStatus",
                    "extendedLikesInfo.newestLikes":"$newestLikes"
                }
            }])

        const temp = post.map((p) => {
            const likesCountArr = p.extendedLikesInfo.likesCount
            const dislikesCountArr = p.extendedLikesInfo.dislikesCount
            const myStatusArr = p.extendedLikesInfo.myStatus

            const extendedLikesInfo = {
                likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
                dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
                myStatus: myStatusArr.length ? myStatusArr[0].status : "None",
                newestLikes:p.extendedLikesInfo.newestLikes
            }
            p.extendedLikesInfo = extendedLikesInfo
            return p
        });

        /**/
        return temp[0]
    }
    async deletePost(id:string){
        const result = await PostsModel.deleteOne({_id:new ObjectId(id)});
        return result.deletedCount === 1
    }
    async createPost(post:postType){
        const createdPost = new PostsModel(post)
        createdPost.save();
        createdPost.extendedLikesInfo ={
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
        }

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
        return true//result.matchedCount === 1
    }

    async getPostsByBlogId(userId:ObjectId, blogId:ObjectId,pageNumber:number, pageSize:number,sortBy:string,sortDirection:any){

        console.log(blogId)
        //@ts-ignore
        const posts = await PostsModel.aggregate([{$match:{blogId:blogId}},{
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "postId",
                pipeline: [{
                    $match: {
                        "status": "Like"
                    },
                },
                    {
                        $count: "count"
                    }
                ],
                as: "likesCount"
            }
        },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: {
                            "status": "Dislike"
                        },
                    },
                        {
                            $count: "count"
                        }
                    ],
                    as: "dislikesCount"
                }
            }, {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: { "userId": userId }
                    }, {
                        $project: { _id: 0, "status": 1 }
                    }],
                    as: "myStatus"
                }
            }, {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    pipeline: [{
                        $match: {
                            "status": "Like"
                        },
                    },{
                        $sort: {
                            _id: 1
                        },
                    },{
                        $limit: 3
                    },{
                        $project:{
                            addedAt:1,
                            login:1,
                            userId:1,
                            _id:0
                        }
                    }],
                    as: "newestLikes"
                }
            },
            {
                $project:{
                    _id: 0,
                    id: "$_id",
                    "title": 1,
                    "shortDescription": 1,
                    "content": 1,
                    "blogId": 1,
                    "blogName":1,
                    "createdAt": 1,
                    "extendedLikesInfo.likesCount": "$likesCount",
                    "extendedLikesInfo.dislikesCount": "$dislikesCount",
                    "extendedLikesInfo.myStatus":"$myStatus",
                    "extendedLikesInfo.newestLikes":"$newestLikes"
                }
            }])
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )

        const temp = posts.map((p) => {
            const likesCountArr = p.extendedLikesInfo.likesCount
            const dislikesCountArr = p.extendedLikesInfo.dislikesCount
            const myStatusArr = p.extendedLikesInfo.myStatus

            const extendedLikesInfo = {
                likesCount: likesCountArr.length ? likesCountArr[0].count : 0,
                dislikesCount: dislikesCountArr.length ? dislikesCountArr[0].count : 0,
                myStatus: myStatusArr.length ? myStatusArr[0].status : "None",
                newestLikes:p.extendedLikesInfo.newestLikes
            }
            p.extendedLikesInfo = extendedLikesInfo
            return p
        });        //@ts-ignore
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
