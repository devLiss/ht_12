import {UserRepo} from "./repositories/user-db-repo";
import {UserService} from "./application/user-service";
import {Container} from "inversify";
import {AuthController} from "./controllers/auth-controller";
import {UserController} from "./controllers/user-controller";
import {CommentsController} from "./controllers/comment-controller";
import {PostController} from "./controllers/post-controller";
import {SessionController} from "./controllers/session-controller";
import {AuthService} from "./application/auth-service";
import {CommentsService} from "./application/comments-service";
import {SessionService} from "./application/session-service";
import {PostService} from "./application/post-service";
import {BlogsController} from "./controllers/blogs-controller";
import {BlogsService} from "./application/blogs-service";
import {BlogsRepo} from "./repositories/blog-db-repo";
import {CommentRepo} from "./repositories/comment-db-repo";
import {LikesRepo} from "./repositories/likes-db-repo";
import {JwtService} from "./application/jwt-service";
import {PostRepo} from "./repositories/post-db-repo";
import {RequestDbRepo} from "./repositories/request-db-repo";
import {SessionDbRepo} from "./repositories/session-db-repo";

export const container = new Container()
//controllers
container.bind<UserController>(UserController).to(UserController)
container.bind<AuthController>(AuthController).to(AuthController)
container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<PostController>(PostController).to(PostController)
container.bind<SessionController>(SessionController).to(SessionController)
container.bind<BlogsController>(BlogsController).to(BlogsController)

//services
container.bind<UserService>(UserService).to(UserService)
container.bind<AuthService>(AuthService).to(AuthService)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<SessionService>(SessionService).to(SessionService)
container.bind<PostService>(PostService).to(PostService)
container.bind<BlogsService>(BlogsService).to(BlogsService)
container.bind<JwtService>(JwtService).to(JwtService)

//repos
container.bind<UserRepo>(UserRepo).to(UserRepo)
container.bind<BlogsRepo>(BlogsRepo).to(BlogsRepo)
container.bind<CommentRepo>(CommentRepo).to(CommentRepo)
container.bind<LikesRepo>(LikesRepo).to(LikesRepo)
container.bind<PostRepo>(PostRepo).to(PostRepo)
container.bind<RequestDbRepo>(RequestDbRepo).to(RequestDbRepo)
container.bind<SessionDbRepo>(SessionDbRepo).to(SessionDbRepo)
