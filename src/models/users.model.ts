import mongoose from "mongoose";

const emailConfirmationSchema = new mongoose.Schema({
    confirmationCode:{type:String,required:true},
    expirationDate:{type:Date,required:true},
    isConfirmed:{type:Boolean, required:true}
},{ _id : false, versionKey: false })
const recoverySchema = new mongoose.Schema({
    recoveryCode:{type:String,required:true},
    expirationDate:{type:Date,required:true},
    isConfirmed:{type:Boolean, required:true}
},{ _id : false, versionKey: false })
const userScheme = new mongoose.Schema({
    createdAt:{type:String,required:true},
    email:{type:String,required:true},
    login:{type:String,required:true},
    passwordHash:{type:String,required:true},
    passwordSalt:{type:String,required:true},
    emailConfirmation:{type:emailConfirmationSchema, required:true},
    recoveryData:{type:recoverySchema}
},{
    versionKey: false // You should be aware of the outcome after set to false
})
userScheme.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.passwordHash
    delete obj.passwordSalt
    delete obj.emailConfirmation
    return obj
}
export const UserModel = mongoose.model('users', userScheme)