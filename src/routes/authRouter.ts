import {Router} from "express";
import {inputValidationMiddleware, inputValidationMiddlewareV2} from "../middlewares/inputValidationMiddleware";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleware";
import {responseCountMiddleware} from "../middlewares/responseCountMiddleware";
import {container} from "../composition-root";
import {AuthController} from "../controllers/auth-controller";


export const authRouter = Router({})
const authController = container.resolve(AuthController)


authRouter.post('/login',
    body('login').trim().isLength({min:1}),
    body('password').trim().isLength({min:1}) ,
    inputValidationMiddlewareV2, responseCountMiddleware, authController.login)

authRouter.post('/password-recovery',body('email').trim().isLength({min:1}).isEmail(),inputValidationMiddleware,responseCountMiddleware, authController.passwordRecovery)
authRouter.post('/new-password',body('newPassword').trim().isLength({min:6, max:20}),inputValidationMiddleware,responseCountMiddleware,authController.changePassword)
authRouter.post('/refresh-token',authController.refresehToken)
authRouter.post('/registration-confirmation',responseCountMiddleware,authController.confirmRegistation)
authRouter.post('/registration',responseCountMiddleware/*,loginValidator, passwordValidator, loginRegValidation, emailRegValidation, inputValidationMiddleware*/,authController.registerUser)

authRouter.post('/registration-email-resending',responseCountMiddleware,/*emailNotExistsValidation, inputValidationMiddleware,*/authController.resendConfirmationCode)
authRouter.post('/logout',authController.logout)
authRouter.get('/me', authMiddleware, authController.getInfoByMe)