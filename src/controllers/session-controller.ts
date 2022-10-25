import {Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {SessionService} from "../application/session-service";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class SessionController {

    constructor(protected jwtService: JwtService,
                protected sessionService: SessionService) {
    }

    async getUserSessions(req: Request, res: Response) {
        if (!req.cookies.refreshToken) {
            res.sendStatus(401)
            return
        }
        const payload = await this.jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
        if (!payload) {
            res.sendStatus(401)
            return
        }
        const sessions = await this.sessionService.getSessionsByUserId(payload.userId)
        res.status(200).send(sessions)
    }

    async deleteAllSessions(req: Request, res: Response) {
        if (!req.cookies.refreshToken) {
            res.sendStatus(401)
            return
        }
        const payload = await this.jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
        if (!payload) {
            res.sendStatus(401)
            return
        }
        const isDeleted = await this.sessionService.removeSessionsByUserId(payload.userId, payload.deviceId);
        if (!isDeleted) {
            res.sendStatus(401)
            return
        }

        res.sendStatus(204)
    }

    async deleteOtherSessions(req: Request, res: Response) {
        if (!req.cookies.refreshToken) {
            res.sendStatus(401)
            return
        }
        const payload = await this.jwtService.getPayloadByRefreshToken(req.cookies.refreshToken)
        if (!payload) {
            res.sendStatus(401)
            return
        }
        const session = await this.sessionService.getSessionByDeviceId(req.params.id);
        if (!session) {
            res.sendStatus(404)
            return
        }

        console.log("USER ID")
        console.log(session)
        console.log(payload)


        const payloadUserId = new ObjectId(payload.ObjectId)
        console.log(payloadUserId)
        if (session.userId !== payload.userId) {
            res.sendStatus(403)
            return
        }

        const isDeleted = await this.sessionService.removeSessionByDeviceId(payload.userId, req.params.id)
        res.sendStatus(204)
    }
}