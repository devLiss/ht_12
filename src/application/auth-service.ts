import {emailManager} from "../managers/emailManager";
import {UserRepo} from "../repositories/user-db-repo";
import {UserService} from "./user-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {inject, injectable} from "inversify";
@injectable()
export class AuthService{
    constructor(@inject(UserRepo) protected userRepo:UserRepo,
                @inject(UserService) protected userService:UserService
                /*protected emailManager:EmailManager*/) {
    }
    async confirmEmail(code:string){
        const user = await this.userRepo.getUserByCode(code);
        console.log(user)
        if(!user) {return false}
        if(user.emailConfirmation.isConfirmed) {return false}
        console.log(user.id)
        const result = await this.userRepo.updateConfirmation(user.id);
        return true
    }
    async sendRecoveryCode(email:string){
        let user = await this.userRepo.getByEmail(email);
        console.log(email);
        console.log(user);
        console.log("Recovery Code")
        if(!user){
            console.log("User not found")
            return null
        }

        const recoveryCode = uuidv4();
        const recoveryData = {
            recoveryCode:recoveryCode,
            expirationDate:add(new Date(), {hours:1, minutes:3}),
            isConfirmed: false
        }
        console.log(recoveryCode)
        const updatedUser = await this.userRepo.createRecoveryData(user.id, recoveryData)
        const result = await emailManager.sendRecoveryCode(updatedUser)
        return result
    }
    async confirmPassword(newPassword:string, recoveryCode:string){
        const user = await this.userRepo.getUserByRecoveryCode(recoveryCode)
        if(!user){return false}
        if(user.recoveryData.isConfirmed) {return false}

        const passwordData = await this.userService.generatePasswordHash(newPassword);
        console.log("confirm password")
        console.log(user)
        console.log(passwordData)
        await this.userRepo.confirmPassword(user._id,passwordData)
        return true
    }
    async resendConfirmCode(email:string){
        let user = await this.userRepo.getByEmail(email);
        console.log("RESEND ")
        if(!user){
            return null
        }
        const confirmCode = uuidv4();
        const updateRes = await this.userRepo.updateConfirmationCode(user.id, confirmCode)
        user = await this.userRepo.getByEmail(email);
        const result = await emailManager.sendConfirmation(user)
        return result
    }
}