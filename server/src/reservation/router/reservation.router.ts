import { Router } from "express";
import passport from "passport";
import { ReservationController } from "../controller/reservation.contoller";

export class ReservationRouter {
  private router = Router();

  constructor(private reservationController: ReservationController) {
    this.initRouters();
  }

  //TODO set auth middleware
  private initRouters() {
    
    this.router.delete("/some", this.reservationController.deleteSome);
    this.router.get("/", this.reservationController.getAllReservations);
    this.router.post('/generate-csv', this.reservationController.getCsv)
    this.router.post("/:code", this.reservationController.createReservation);
    this.router.get("/:code", this.reservationController.findReservation);
    this.router.patch("/", this.reservationController.deleteReservation);
    this.router.patch("/cancel/:code", this.reservationController.cancelReservation);
    this.router.delete("/statystic", this.reservationController.getReservStatystic);

  }

  public getRouter() {
    return this.router;
  }
}

export default new ReservationRouter(new ReservationController()).getRouter();
