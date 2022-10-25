import {Router, Request, Response} from "express";
import {userService} from "../application/user-service";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {emailVAlidator, loginValidator, passwordValidator} from "../middlewares/userMiddleware";
import {authGuard} from "../middlewares/authGuard";
import {
    pageNumberSanitizer,
    pageSizeSanitizer, searchEmailTermSanitizer, searchLoginTermSanitizer, searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";

export const userRouter = Router({})

class UserController{
    async getUsers(req:Request, res:Response){
        const {searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query;
        const users = await userService.getUsers(searchLoginTerm, searchEmailTerm,+pageNumber!, +pageSize!, sortBy, sortDirection);
        res.status(200).send(users);
    }
    async createUser(req:Request, res:Response){const {login, password, email} = req.body
        const createdUser = await userService.createUser(login, password, email);

        res.status(201).send(createdUser)}
    async deleteUser(req:Request, res:Response){
        const {id} = req.params;
        const isDeleted = await userService.deleteUser(id)
        isDeleted ? res.send(204) : res.send(404)
    }
}

const userController = new UserController()

userRouter.get('/',searchLoginTermSanitizer,searchEmailTermSanitizer, pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer,userController.getUsers)
userRouter.post('/'/*,authGuard*/,loginValidator, passwordValidator, emailVAlidator, inputValidationMiddleware, userController.createUser)
userRouter.delete('/:id',authGuard, inputValidationMiddleware, userController.deleteUser)