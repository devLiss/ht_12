import {v4 as uuidv4} from "uuid";
import {SessionDbRepo} from "../repositories/session-db-repo";
import {SessionDbType, SessionType} from "../types";
import {JwtService} from "./jwt-service";
import {parseConnectionUrl} from "nodemailer/lib/shared";
import jwt from "jsonwebtoken";
import {inject, injectable} from "inversify";

@injectable()
export class SessionService {

    constructor(@inject(JwtService) protected jwtService:JwtService,
                @inject(SessionDbRepo) protected sessionDbRepo:SessionDbRepo) {
    }
    async createSession(user:any, ip:string, title:string):Promise<{accessToken:string, refreshToken:string} | null>{
        const userId = user.id.toString();
        const deviceId = uuidv4();

        const tokens = await this.jwtService.generateTokens(userId, deviceId);
        const payload = await this.jwtService.getPayloadByRefreshToken(tokens.refreshToken);

        if(!payload){
            return null
        }
        console.log(payload)
        const session:SessionDbType = {
                ip,
                title,
                lastActiveDate:new Date(payload.iat * 1000 ),
                expiredDate:new Date(payload.exp * 1000),
                deviceId,
                userId
        }
        const createdSession = await this.sessionDbRepo.createSession(session)

        return {
            accessToken:tokens.accessToken,
            refreshToken:tokens.refreshToken,
        }
    }

    async updateSession(refreshToken:string):Promise<{accessToken:string, refreshToken:string}|null>{
        const payload = await this.jwtService.getPayloadByRefreshToken(refreshToken);
        console.log("UPDATE SESSION PAYLOAD")
        if(!payload){
            return null
        }
        const session = await this.sessionDbRepo.getSessionByUserByDeviceAndByDate(payload.userId, payload.deviceId, new Date(payload.iat * 1000))
        if(!session){
            return null
        }

        const tokens = await this.jwtService.generateTokens(payload.userId, payload.deviceId);
        const newPayload = await this.jwtService.getPayloadByRefreshToken(tokens.refreshToken);

        
        if(!newPayload){
            console.log("null")
        }
        await this.sessionDbRepo.updateSession(newPayload.userId,
            newPayload.deviceId,
            new Date(newPayload.expiredDate * 1000),
            new Date(newPayload.iat * 1000));
        return {
            accessToken:tokens.accessToken,
            refreshToken:tokens.refreshToken,
        }
    }
    async removeSessionByDeviceId(userId:string, devId:string){
        return await this.sessionDbRepo.removeSessionByDeviceId(userId,devId);
    }

    async removeSessionsByUserId(userId:string, deviceId:string){
        return await this.sessionDbRepo.removeAllSessionsByUserId(userId, deviceId);
    }

    async getSessionsByUserId(userId:string){
                return await this.sessionDbRepo.getSessionsByUserId(userId);
    }
    async getSessionByDeviceId(deviceId:string){
        return await this.sessionDbRepo.getSessionByDeviceId(deviceId);
    }
}