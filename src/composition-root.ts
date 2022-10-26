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
container.bind<AuthController>(AuthController).toSelf()
container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<PostController>(PostController).to(PostController)
container.bind<SessionController>(SessionController).to(SessionController)
container.bind<BlogsController>(BlogsController).to(BlogsController)

//services
container.bind<UserService>(UserService).toSelf()
container.bind<AuthService>(AuthService).toSelf()
container.bind<CommentsService>(CommentsService).toSelf()
container.bind<SessionService>(SessionService).toSelf()
container.bind<PostService>(PostService).toSelf()
container.bind<BlogsService>(BlogsService).toSelf()
container.bind<JwtService>(JwtService).toSelf()

//repos
container.bind<UserRepo>(UserRepo).toSelf()
container.bind<BlogsRepo>(BlogsRepo).toSelf()
container.bind<CommentRepo>(CommentRepo).toSelf()
container.bind<LikesRepo>(LikesRepo).toSelf()
container.bind<PostRepo>(PostRepo).toSelf()
container.bind<RequestDbRepo>(RequestDbRepo).toSelf()
container.bind<SessionDbRepo>(SessionDbRepo).toSelf()
