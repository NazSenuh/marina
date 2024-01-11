import { Router } from "express";
import { SeasonController } from "../controller/season.controller";
import passport from "passport";

export class SeasonRouter {
  private router = Router();

  constructor(private seasonController: SeasonController) {
    this.initRouters();
  }

  private initRouters() {
    this.router.patch(
      "/",
      passport.authenticate("jwt"),
      this.seasonController.closeSeason
    );
    this.router.post(
      "/",
      passport.authenticate("jwt"),
      this.seasonController.createSeason
    );
    this.router.post(
      "/announcement",
      //passport.authenticate("jwt"),
      this.seasonController.sendAnnouncement
    );
    this.router.get(
      "/",
      passport.authenticate("jwt"),
      this.seasonController.getAllSeasons
    );
    this.router.get(
      "/activeSeason",
      passport.authenticate("jwt"),
      this.seasonController.getActiveSeason
    );
    this.router.get(
      "/current",
      // passport.authenticate("jwt"),
      this.seasonController.getActiveSeason
    );
    this.router.post(
      "/closeActiveSeasonAndCreateNew",
      //passport.authenticate("jwt"),
      this.seasonController.closeActiveSeasonAndCreateNew
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default new SeasonRouter(new SeasonController()).getRouter();
