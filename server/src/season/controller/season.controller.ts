import { Request, Response } from "express";
import SeasonService from "../service/season.service";

export class SeasonController {
  public async createSeason(req: Request, res: Response) {
    const seasonNumber = req.body.seasonNumber;
    try {
      const season = await SeasonService.createSeason({ ...req.body });
      res.send(season);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send(`Failed to create a season #${seasonNumber}: ${error}`);
    }
  }

  public async getActiveSeason(_: Request, res: Response) {
    try {
      const season = await SeasonService.getActiveSeason();
      res.send(season);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send(`Failed to get an active season: ${error}`);
    }
  }

  public async closeActiveSeasonAndCreateNew(_: Request, res: Response) {
    try {
      const currentActiveSeason = await SeasonService.getActiveSeason()
      if (!currentActiveSeason) {
        throw new Error("Active season does not exist");
      };
      const closedSeason = await SeasonService.closeSeason(currentActiveSeason)

      
     
      if(closedSeason){
        const seasonNumber = closedSeason?.seasonNumber;
        const newSeasonNumber = (Number(seasonNumber) + 1).toString();
        const newSeason = await SeasonService.createSeason({
          seasonNumber: newSeasonNumber,
          status: "active",
        });
        res.send(newSeason)
      }
      
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send(`Failed to close the active season and create a new: ${error}`);
    }
  }

  public async getAllSeasons(_: Request, res: Response) {
    const seasons = await SeasonService.getAll();
    res.send(seasons);
  }

  public async closeSeason(req: Request, res: Response) {
    const seasonNumber = req.body.seasonNumber;
    try {
      const closedSeason = await SeasonService.closeSeason({ ...req.body });
      res.send(closedSeason);
    } catch (error) {
      res
        .status(500)
        .send(`Failed to close season: ${seasonNumber}, error: ${error}`);
    }
  }


  public async sendAnnouncement(req: Request, res: Response) {
    try {
      const announcement = await SeasonService.sendAnnouncement({...req.body});
      res.send(announcement);
    } catch (error) {
      res
        .status(500)
        .send(`Failed to send announcement,  ${error}`);
    }
  }
}
