
import {RequestModel} from "../models/request.model";
import {injectable} from "inversify";
@injectable()
export class RequestDbRepo{
    async createRequestRow (ip:string, url:string, requestDate:Date){
        const request = new RequestModel({ip, url, requestDate})
        await request.save();
        //await RequestModel.insertOne({ip, url, requestDate});
        return true;
    }
    async getRequestsCountPer10sec(ip:string, url:string, date:Date){
        const requestsCount = await RequestModel.count({ip:ip, url:url, requestDate:{$gte:date}})
        return requestsCount
    }
}
