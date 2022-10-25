import {ObjectId, WithId} from "mongodb";
import {userAccountDbType, userDBType, userType} from "../types";
import {UserModel} from "../models/users.model";

interface userDb{
    id?:string|ObjectId
    login:string
    email:string
    passwordHash:string
    createdAt:string
    passwordSalt:string
    emailConfirmation:{
        confirmationCode:string
        expirationDate:Date
        isConfirmed:boolean
    }
    recoveryData?:{
        recoveryCode:string
        expirationDate:Date
        isConfirmed:boolean
    }
}

export const userRepo = {
    async createUser(user:userDb):Promise<userDb>{
        const createdUser = new UserModel(user)
        await createdUser.save()
        return createdUser;
},
    async findByLoginOrEmail(loginOrEmail:string):Promise<any>{
        const user = await UserModel.findOne({$or:[{"email":loginOrEmail},{"login":loginOrEmail}]})
        return user

    },
    async findByLogin(login:string){
        const user = await UserModel.findOne({login:login}/*{$or:[{"email":loginOrEmail},{"userName":loginOrEmail}]}*/)
        return user;
},
    async findById(id:string){
        const user = await UserModel.findById(id)
        console.log("Repo")
        console.log(user)
        return user
    },
    async deleteUser(id:string){
        const result = await UserModel.deleteOne({_id:new ObjectId(id)})
        return result.deletedCount === 1
    },

    async getUsers(searchLoginTerm:string, searchEmailTerm:string, pageNumber:number,pageSize:number, sortBy:string, sortDirection:any){
        const users = await UserModel.find({$or:[{"login":{$regex:searchLoginTerm, $options : 'i' }},{"email":{$regex: searchEmailTerm,$options : 'i' }}]})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .sort( {[sortBy] : sortDirection} )

        const temp = users.map((user) => {
            return user.toJSON()
        })

        const totalCount = await UserModel.count({$or:[{"login":{$regex:searchLoginTerm, $options : 'i' }},{"email":{$regex: searchEmailTerm,$options : 'i' }}]});

        const outputObj = {
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:temp
        }
        return outputObj
    },
    async deleteAll():Promise<boolean>{
        const result = await UserModel.deleteMany({})
        return result.deletedCount === 1
    },

    async updateConfirmation(id:string){
        const result = await UserModel.updateOne({_id:new ObjectId(id)}, {$set:{"emailConfirmation.isConfirmed":true}})
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(id:string, code:string){
        const result = await UserModel.updateOne({_id:new ObjectId(id)}, {$set:{"emailConfirmation.confirmationCode":code}})
        return result.modifiedCount === 1
    },

    async getUserByCode(code:string):Promise<any>{
        const user = await UserModel.findOne({"emailConfirmation.confirmationCode":code})
        if(user){
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }

        return user
    },
    async getByEmail(email:string){
        const user = await UserModel.findOne({email:email})
        if(user){
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }

        return user;
    },

    async createRecoveryData(userId:ObjectId, recovery:{recoveryCode:string,expirationDate:Date,isConfirmed:boolean}){
      const user =  await UserModel.updateOne({_id:userId},{$set:{recoveryData:recovery}})
        const updatedUser = await UserModel.findOne({_id:userId})
        console.log(updatedUser)
        return updatedUser
    },
    async confirmPassword(userId:string, passwordData:{passwordSalt:string,passwordHash:string}){
        const user =  await UserModel.findOneAndUpdate(
            {_id:new ObjectId(userId)},
            {$set:{
                "recoveryData.isConfirmed":true,
                passwordHash:passwordData.passwordHash,
                passwordSalt:passwordData.passwordSalt
            }})
        return user
    },

    async getUserByRecoveryCode(code:string):Promise<any>{
        const user = await UserModel.findOne({"recoveryData.recoveryCode":code})
        return user
    },

}