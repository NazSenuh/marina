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

      // console.log(req.body ,'ddd')

      const reservation = await ReservationModel.create({
        ...req.body,
        slip: boat._id,
        type: EStatus.ACTIVE,
      });

      boat.reservations.push(reservation._id);

      slipService.modifySlip(code, {
        type: EType.RESERVED,
        reservations: boat.reservations,
      });

      //   const accountSid = 'ACcb1087e7178eef0d869f237c6bfe2357';
      //   const authToken = 'a863042269894551eeeb3419d0aa5129';
      //   const client = require('twilio')(accountSid, authToken);

        const message = (parkingCode:string, startDate: string, endDate: string) => {
          return `Ви забронювали місце ${parkingCode} з ${startDate} по ${endDate}`
        }

      //    client.messages.create({
      //   body: message(req.params.code, req.body.startDate, req.body.endDate),
      //   from: '+16364029949',
      //   to: req.body.phoneNumber
      // })

      var https = require("follow-redirects").https;
      var fs = require("fs");

      var options = {
        method: "POST",
        hostname: "43pzkp.api.infobip.com",
        path: "/sms/2/text/advanced",
        headers: {
          Authorization:
            "App b51d41278696f117afa07897438d5842-7062cadc-0a2d-4732-b761-bd904eb96bcd",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        maxRedirects: 20,
      };

      var requ = https.request(options, function (resp:any) {
        var chunks:any = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      var postData = JSON.stringify({
        messages: [
          {
            destinations: [{ to: req.body.phoneNumber }],
            from: "ServiceSMS",
            text: message(req.params.code, req.body.startDate, req.body.endDate)
          },
        ],
      });

      requ.write(postData);

      requ.end();

      const timePart = req.body.startDate.split(" ")[1];
      const hour = timePart.split(":")[0];
      await reservationService.reservStatystic(hour);
      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }
  public async getReservStatystic(req: Request, res: Response) {
    try {
      const reservation = await ReservationService.getReservStatystic();
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
      const reservation = await ReservationService.deleteAllReservations(
        req.body
      );

      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async cancelReservation(req: Request, res: Response) {
    try {
      const slipCode = req.params.code;
      const slip = await SlipModel.findOne({ code: slipCode });

      if (slip) {
        const reservation = await ReservationService.modifyReservations(
          slip._id,
          {
            type: EStatus.CANSELED,
          }
        );

        res.send(reservation);
      }
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }

  public async getCsv(req: Request, res: Response) {
    try {
      const buffer = await ReservationService.generateCsv(req.body);
      res.send(buffer);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }
  public async deleteSome(req: Request, res: Response) {
    try {
      const reservation = await ReservationService.deleteSomeReservation();
      res.send(reservation);
    } catch (e: any) {
      res.status(e.status || 500).json(e.message);
    }
  }
}
