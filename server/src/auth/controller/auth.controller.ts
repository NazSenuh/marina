import { Request, Response } from "express";
import authService from "../service/auth.service";

export class AuthController {

    public async login(req: Request, res: Response) {
        try {
            const token = await authService.login(req.body)
            res.json(token)
        } catch(e:any) {
            res.status(e.status|| 500).json(e)
        }
    }

    public async recover(req: Request, res: Response) {
        try {
            const link = await authService.changePassword(req.body)
            res.json(link)
        } catch(e:any) {
            res.status(e.status|| 500).json(e)
        }
    }

    public async activate(req: Request, res: Response) {
        try {
            const link = req.params.link;
            const {password, email, confirmPassword} = req.body
            
            const user =  await authService.activate(link, email, password, confirmPassword);
            res.json(user)
        } catch(e:any) {
            res.status(e.status|| 500).json(e)
        }
    }
}
export default new AuthController()