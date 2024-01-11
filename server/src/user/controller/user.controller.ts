import { Request, Response } from "express";
import userService from "../service/user.service";
import dayjs from "dayjs";


export class UserController {
    
    public async createUser(req: Request, res: Response) {
        try {
            const user = await userService.createUser({ ...req.body })
            res.send(user)
            
        } catch (e:any) {
            res.status(e.status|| 500).json(e)
        }
    }   
    
    public async getUsers(req: Request, res: Response) {
        const users = await userService.getAll()
        res.send(users)
    } 

    public async getUser(req: Request, res: Response) {
        try {
            const email = req.body.email || req.params.email
            const user = await userService.getUser({email})
            res.send(user)
        } catch (e:any) {
            res.status(e.status|| 500).json(e)
        }
    } 

    public async checkEmail(req: Request, res: Response) {
        try {
            const request = req.query.email
            const link = req.params.data

            const user = await userService.getUser({email: request?.toString()})
            const timeNow = dayjs()
            const expirityTime = user?.recoveryLink?.expiredAt
            const isValid = timeNow.isBefore(expirityTime)
            if(!isValid){
                throw new Error("Link was expired");
            }
            if(link !== user?.recoveryLink?.link){
                throw new Error("Link is uncorrect");
            }
            res.send(user)
        } catch (e:any) {
            res.status(e.status|| 500).json(e)
        }
    } 

}


