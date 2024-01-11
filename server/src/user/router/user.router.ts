import { Router } from "express";
import { UserController } from "../controller/user.controller";

import passport from "passport";

export class UserRouter{
    private router = Router()

    constructor(private userController: UserController) {
        this.initRouters()
    }

    private initRouters() {
        this.router.get('/', this.userController.getUsers)
        this.router.post('/email', this.userController.getUser )
        this.router.get('/verify/:data', this.userController.checkEmail)
        this.router.post('/', this.userController.createUser )

    }

    public getRouter() {
        return this.router
    }
}

export default new UserRouter(new UserController()).getRouter()