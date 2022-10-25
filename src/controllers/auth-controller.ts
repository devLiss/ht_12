import {SessionService} from "../application/session-service";
import {UserService} from "../application/user-service";
import {AuthService} from "../application/auth-service";
import {JwtService} from "../application/jwt-service";
import {Request, Response} from "express";
import dayjs from "dayjs";
import {injectable} from "inversify";
@injectable()
export class AuthController {
    constructor(protected sessionService:SessionService,
                protected userService:UserService,
                protected authService:AuthService,
                protected jwtService:JwtService
    ) {
    }
    async login(req: Request, res: Response) {
        const user = await this.userService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            res.sendStatus(401)
            return
        }
        const session = await this.sessionService.createSession(user, req.ip, req.headers["user-agent"]!);

        if (!session) {
            console.log("!!! NE SESSION !!! ")
            res.sendStatus(401)
            return
        }
        res.cookie('refreshToken', session.refreshToken, {
            secure: true,
            expires: dayjs().add(20, "seconds").toDate(),
            httpOnly: true,
        });

        res.status(200).send({
            accessToken: session.accessToken
        })
    }
    async passwordRecovery(req: Request, res: Response){
        await this.authService.sendRecoveryCode(req.body.email);
        res.sendStatus(204)
    }
    async changePassword(req: Request, res: Response){
        console.log(req.body.newPassword," NEW PASSWORD ",req.body.recoveryCode)
        const confirmation = await this.authService.confirmPassword(req.body.newPassword,req.body.recoveryCode)
        if(!confirmation){
            res.status(400).send({
                errorsMessages: [
                    { message: "Некорректный recoveryCode", field: "recoveryCode" }
                ]
            })
            return
        }
        res.sendStatus(204)
    }
    async refresehToken(req: Request, res: Response){
        if(!req.cookies.refreshToken){
            res.sendStatus(401)
            return
        }
        const refreshToken = req.cookies.refreshToken
        const tokens = await this.sessionService.updateSession(refreshToken);
        if(!tokens){
            res.sendStatus(401);
            return
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            expires:  dayjs().add(20, "seconds").toDate(),
            secure:true,
            httpOnly: true,
        });
        res.status(200).send({
            accessToken:tokens.accessToken
        })}
    async confirmRegistation(req: Request, res: Response){
        const result = await this.authService.confirmEmail(req.body.code)

        console.log(result);
        if(result){
            res.status(204).send(result);
            return
        }
        res.status(400).send({errorsMessages:[{
                message:"некорректный код",
                field:"code"
            }]})}
    async registerUser(req: Request, res: Response){  const createdUser = await this.userService.createUser(req.body.login, req.body.password, req.body.email)

        if(!createdUser){
            res.sendStatus(400)
            return
        }
        res.sendStatus(204)}
    async resendConfirmationCode(req: Request, res: Response){
        const result = await this.authService.resendConfirmCode(req.body.email)
        res.sendStatus(204)
    }
    async logout(req: Request, res: Response){
        if(!req.cookies.refreshToken){
            res.sendStatus(401)
            return
        }
        const refreshToken = req.cookies.refreshToken
        const payload = await this.jwtService.getPayloadByRefreshToken(refreshToken)
        if(!payload){
            res.sendStatus(401)
            return
        }

        await this.sessionService.removeSessionByDeviceId(payload.userId,payload.deviceId);
        res.clearCookie("refreshToken");
        res.sendStatus(204)}
    async getInfoByMe(req: Request, res: Response){
        //@ts-ignore
        console.log(req.user)
        //@ts-ignore
        const user = await userService.getUserById(req.user!.id)

        if(user){
            //@ts-ignore
            delete Object.assign(user, {["userId"]: user["id"] })["id"]
        }

        res.status(200).send(user)}
}