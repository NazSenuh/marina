import { Application, Request, Response } from "express";
import userRouter from "../user/router/user.router";
import authRouter from "../auth/router/auth.router";
import slipRouter from "../slips/router/slip.router";
import reservationRouter from "../reservation/router/reservation.router";
import seasonRouter from "../season/router/season.router";
import * as os from 'node:os';

export class AppRouter {
  constructor(private app: Application) { }

  init() {
    this.app.get("/", (_: Request, res: Response) => {
      const networkInterfaces = os.networkInterfaces()

      const ipAddress = Object.keys(networkInterfaces)
        .map(interfaceName => networkInterfaces[interfaceName]!.find(item => item.family === 'IPv4' && !item.internal))
        .filter(Boolean)[0]?.address;
            
      res.send(`boostrap ${ipAddress}`)
    });

    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/slips", slipRouter);
    this.app.use("/api/season", seasonRouter);
    this.app.use("/api/reservations", reservationRouter);
  }
}
