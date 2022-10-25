import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/inputValidationMiddleware";
import {emailVAlidator, loginValidator, passwordValidator} from "../middlewares/userMiddleware";
import {authGuard} from "../middlewares/authGuard";
import {
    pageNumberSanitizer,
    pageSizeSanitizer, searchEmailTermSanitizer, searchLoginTermSanitizer, searchNameTermSanitizer,
    sortBySanitizer,
    sortDirectionSanitizer
} from "../middlewares/sanitazers";
import {container} from "../composition-root";
import {UserController} from "../controllers/user-controller";

export const userRouter = Router({})
const userController = container.resolve(UserController)

userRouter.get('/',searchLoginTermSanitizer,searchEmailTermSanitizer, pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer,sortDirectionSanitizer,userController.getUsers)
userRouter.post('/'/*,authGuard*/,loginValidator, passwordValidator, emailVAlidator, inputValidationMiddleware, userController.createUser)
userRouter.delete('/:id',authGuard, inputValidationMiddleware, userController.deleteUser)