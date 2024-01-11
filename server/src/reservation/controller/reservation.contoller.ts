import { Request, Response } from "express";
import ReservationService from "../service/reservation.service";
import slipService from "../../slips/service/slip.service";
import { ReservationModel } from "../model/reservation.model";
import { SlipModel } from "../../slips/model/slip.model";
import { EType } from "../../slips/types";
import { CustomError } from "../../common/error";
import reservationService from "../service/reservation.service";
import seasonService from "../../season/service/season.service";
import { EStatus } from "../types";

export class ReservationController {
  public async getAllReservations(_: Request, res: Response) {
    try {
      const reservations = await reservationService.getAllReservations();
      res.send(reservations);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async createReservation(req: Request, res: Response) {
    try {

      const code = req.params.code;
      const boat = await slipService.getOne(code);
      if (!boat) {
        throw new CustomError("no such boat", 400);
      }

      const {season} = req.body;

      const reservationSeason = await seasonService.getSeason(season);
     
      const reservation = await ReservationModel.create({
        ...req.body,
        slip: boat._id,
        season: reservationSeason,
        type:EStatus.ACTIVE
      });

      boat.reservations.push(reservation._id);

      slipService.modifySlip(code, {
        type: EType.RESERVED,
        reservations: boat.reservations,
      });

      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async findReservation(req: Request, res: Response) {
    try {
      const reservation = await ReservationService.findreservation(
        req.params.code
      );

      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }
  public async deleteReservation(req: Request, res: Response) {
    try {
      const reservation = await ReservationService.deleteAllReservations(req.body)

      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async cancelReservation(req: Request, res: Response) {
    try {
      const slipCode = req.params.code
      const slip = await SlipModel.findOne({code: slipCode})

      if(slip){
        const reservation = await ReservationService.modifyReservations(slip._id, {
          type: EStatus.CANSELED
        })

        res.send(reservation);
      }

    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async getCsv(req: Request, res: Response) {
    try {
      const buffer = await ReservationService.generateCsv(req.body)
      res.send(buffer)
    } catch (e: any) {
      res.status(e.status || 500).json(e.message); 
    }
  }
}
