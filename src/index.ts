import "reflect-metadata";
import express, {NextFunction, Request, Response} from 'express'
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import {runDB} from "./repositories/db";
import {userRouter} from "./routes/usersRouter";
import {authRouter} from "./routes/authRouter";
import * as dotenv from 'dotenv'
import {commentsRouter} from "./routes/commentsRouter";
import cookieParser from 'cookie-parser'
import {sessionRouter} from "./routes/sessionRouter";
import {container} from "./composition-root";
import {BlogsRepo} from "./repositories/blog-db-repo";
import {PostRepo} from "./repositories/post-db-repo";
import {UserRepo} from "./repositories/user-db-repo";
import {CommentRepo} from "./repositories/comment-db-repo";
import {SessionDbRepo} from "./repositories/session-db-repo";
import {RequestDbRepo} from "./repositories/request-db-repo";
import {LikesRepo} from "./repositories/likes-db-repo";

dotenv.config()
export const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(cookieParser())
app.set('trust proxy', true)

const blogsRepo = container.resolve(BlogsRepo)
const postRepo = container.resolve(PostRepo)
const userRepo = container.resolve(UserRepo)
const commentRepo = container.resolve(CommentRepo)
const sessionDbRepo = container.resolve(SessionDbRepo)
const requestDbRepo = container.resolve(RequestDbRepo)
const likedDbRepo = container.resolve(LikesRepo);

app.delete('/testing/all-data',async (req: Request, res: Response) => {
    await blogsRepo.deleteAll()
    await postRepo.deleteAll()
    await userRepo.deleteAll()
    await commentRepo.deleteAll()
    await sessionDbRepo.deleteAll()
    //requestDbRepo.deleteAll()
    await likedDbRepo.deleteAll()
    res.status(204).send([])
})
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security/devices',sessionRouter)
app.get('/',(req:Request, res:Response)=>{
    res.send('Hello!')
})

const startApp = async () => {
    await runDB();
    app.listen(port,()=>{
        console.log(`Listening port ${port}`);
    })
}

startApp();
