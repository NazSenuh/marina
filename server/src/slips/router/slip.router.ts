import { Router } from "express";
import { SlipController } from "../controller/slip.controller";
import passport from "passport";

export class SlipRouter{
    private router = Router()

    constructor(private slipController: SlipController) {
        this.initRouters()
    }

    //TODO set auth middleware
    private initRouters() {
        this.router.post('/', this.slipController.createSlip)
        this.router.get('/', this.slipController.getAllSlips)
        this.router.get('/:code', this.slipController.getOneSlip)
        this.router.patch('/block/:code',  this.slipController.blockSlip)
        this.router.patch('/modifyAll',  this.slipController.setFree)
        this.router.patch('/unblock/:code', this.slipController.unBlockSlip)
        this.router.put('/modify/:code', this.slipController.modifySlip)
    }

    public getRouter() {
        return this.router
    }
}

export default new SlipRouter(new SlipController()).getRouter()