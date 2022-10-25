import {SessionDbType, SessionType} from "../types";
import {ObjectId} from "mongodb";
import {SessionModel} from "../models/session.model";
import {injectable} from "inversify";
@injectable()
export class SessionDbRepo{

    async createSession(session:SessionDbType):Promise<SessionType>{
        console.log(session)
        const createdSession = new SessionModel(session)
        createdSession.save();
        return {
            ip:createdSession.ip,
            title:createdSession.title,
            lastActiveDate:createdSession.lastActiveDate,
            deviceId:createdSession.deviceId
        }
    }
    async getSessionByDeviceId(deviceId:string){
        const session = await SessionModel.findOne({deviceId:deviceId},{projection:{_id:0}});
        return session;
    }
    async getSessionByUserByDeviceAndByDate(userId:string, deviceId:string, issuedAt:Date){
        const sessions = await SessionModel.find({userId:/*new ObjectId(userId)*/userId, deviceId:deviceId, lastActiveDate:issuedAt}).lean();
        return sessions;
    }

    async updateSession(userId:string,deviceId:string,expiredDate:Date,issuedAt:Date){
        const result = await SessionModel.updateOne({userId:/*new ObjectId(userId)*/userId, deviceId:deviceId}, {$set:{expiredDate:expiredDate, lastActiveDate:issuedAt}})
        return result.matchedCount === 1
    }
    async getSessionsByUserId(userId:string)/*:Promise<SessionType[]>*/{
        const sessions = await SessionModel.find({userId: /*new ObjectId(userId)*/userId}).lean()
        return sessions
    }
    async removeSessionByDeviceId(userId:string,deviceId:string){
        const result = await SessionModel.deleteOne({userId:/*new ObjectId(userId)*/userId,deviceId:deviceId})
        return result.deletedCount === 1
    }

    async removeAllSessionsByUserId(userId:string,deviceId:string){
        const result = await SessionModel.deleteMany({userId:/*new ObjectId(userId)*/userId, deviceId:{$ne:deviceId}})
        return result.deletedCount > 0
    }

    async deleteAll():Promise<boolean>{
        const result = await SessionModel.deleteMany({})
        return result.deletedCount > 1
    }
}
export const sessionDbRepo = new SessionDbRepo()