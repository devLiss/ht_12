import {injectable} from "inversify";
import {UserService} from "../application/user-service";
import {Request, Response} from "express";

@injectable()
export class UserController{

    constructor(protected userService:UserService) {

    }
    async getUsers(req:Request, res:Response){
        const {searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query;
        const users = await this.userService.getUsers(searchLoginTerm, searchEmailTerm,+pageNumber!, +pageSize!, sortBy, sortDirection);
        res.status(200).send(users);
    }
    async createUser(req:Request, res:Response){const {login, password, email} = req.body
        const createdUser = await this.userService.createUser(login, password, email);

        res.status(201).send(createdUser)}
    async deleteUser(req:Request, res:Response){
        const {id} = req.params;
        const isDeleted = await this.userService.deleteUser(id)
        isDeleted ? res.send(204) : res.send(404)
    }
}