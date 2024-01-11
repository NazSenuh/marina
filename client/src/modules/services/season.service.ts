import { ESeason, IAnnouncement, ISeason } from "../types/marina.types";
import { HttpService } from "./http.service";

export class SeasonServices {
  constructor(private httpService: HttpService) {}

  async createSeason(data: ISeason) {
    return this.httpService.post<string, ISeason>("api/season", data, true);
  }

  async getCurrent() {

    const season = await this.httpService.get<{
      seasonNumber: string;
      status: string;
    }>(
      "api/season/current",
      true
    );

    const { seasonNumber } = season;

    localStorage.setItem(ESeason.ACTIVE_SEASON_NUMBER, seasonNumber);

    return season
  }

  async closeActiveSeasonAndCreateNew() {
    return this.httpService.post<string, void>(
      "api/season/closeActiveSeasonAndCreateNew",
      undefined,
      true
    );
  }

  async getAllSeasons() {
    return this.httpService.get<string>("api/season", true);
  }

  async sendAnnouncement( data: IAnnouncement) {
    return this.httpService.post<string, IAnnouncement>("api/season/announcement",data, true);
  }
}

const seasonService = new SeasonServices(new HttpService());
export default seasonService;
