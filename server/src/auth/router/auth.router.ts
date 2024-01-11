import { Router } from "express";
import authController, { AuthController } from "../controller/auth.controller";

class AuthRouter{
    private router = Router()

    constructor(private authController: AuthController) {
        this.initRouters()
    }

    private initRouters() {
        this.router.post('/login', this.authController.login)
        this.router.post('/recover', this.authController.recover)
        this.router.post('/recover/:link',this.authController.activate)
    }
    

    public getRouter() {
        return this.router
    }
}

export default new AuthRouter(authController).getRouter()