import { Request, Response } from "express";
import SlipService from "../service/slip.service";
import { SlipModel } from "../model/slip.model";
import slipService from "../service/slip.service";
import { EType } from "../types";

export class SlipController {
  public async createSlip(req: Request, res: Response) {
    const slip = await SlipService.createSlip({ ...req.body });
    res.send(slip);
  }

  public async getAllSlips(req: Request, res: Response) {
    const slips = await SlipService.getAll();
    res.send(slips);
  }
  public async deleteAllSlips(req: Request, res: Response) {
    const slips = await SlipService.deleteAll();
    res.send(slips);
  }

  public async modifySlip(req: Request, res: Response) {
    try {
      const slip = await SlipService.modifySlip(req.params.code, req.body);
      res.send(slip);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }
  
    public async getOneSlip(req: Request, res: Response) {
        try {
            const slip = await SlipService.getOne(req.params.code)
            res.send(slip);

        } catch (e:any) {
            res.status(e.status|| 500).json(e.message)
        }
    } 


    public async blockSlip(req: Request, res: Response) {
        try {
            const reasons:string = req.body.blockingReason

            const slip = await SlipService.modifySlip(req.params.code,
            {
                type: EType.BLOCKED,
                blockingReason:  {reason: reasons}
            })
            res.send(slip)
        } catch(e:any) {
            res.status(e.status|| 500).json(e.message)
        }
    } 

    public async setFree(req: Request, res: Response) {
      try {

          const slip = await SlipModel.updateMany({
            type: EType.FREE,
            blockingReason:  null
          })
          res.send(slip)
      } catch(e:any) {
          res.status(e.status|| 500).json(e.message)
      }
  } 
    public async unBlockSlip(req: Request, res: Response) {
        try {
            const reasons:string = req.body.blockingReason
            
            const slip = await SlipService.modifySlip(req.params.code,
            {
                type: EType.FREE,
                blockingReason:  null
            })
            res.send(slip)
        } catch(e:any) {
            res.status(e.status|| 500).json(e.message)
        }
    } 
    
}
