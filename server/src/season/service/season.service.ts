import { CreateSeasonDto } from "../dto/create-season.dto";
import { SeasonModel } from "../model/season.model";
import { SlipModel } from "../../slips/model/slip.model";
import { ReservationModel } from "../../reservation/model/reservation.model";
import { CloseSeasonDto } from "../dto/close-season.dto";
import { AnnouncementDto } from "../dto/send-announcement.dto";
import { FindSeasonDto } from "../dto/find-season.dto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { EStatus } from "../../reservation/types";
dayjs.extend(isSameOrAfter)
class SeasonService {
  public async createSeason(dto: CreateSeasonDto) {
    const { seasonNumber, status } = dto;

    const isSeasonStatusActive = status !== "active";
    if (isSeasonStatusActive) {
      throw new Error("You cannot create non-active season.");
    }
    
    const activeSeason = await SeasonModel.findOne({ status });
    if (activeSeason) {
      throw new Error(
        "An active season already exists. You cannot create a new season."
      );
    }

    const seasonWithSameNumber = await SeasonModel.findOne({ seasonNumber });

    if (seasonWithSameNumber) {
      throw new Error(
        "A season with the same number already exists. You cannot create a new season with the same number."
      );
    }

    return SeasonModel.create({ ...dto });
  }

  public async getSeason(dto: FindSeasonDto) {

    const { seasonNumber } = dto;
  
    return SeasonModel.findOne({ seasonNumber });
  }

  public async getAll() {
    return SeasonModel.find();
  }

  public async getActiveSeason() {
    const status = "active";
    try {
      const season = await SeasonModel.findOne({status});
      if(!season){
        const currentYear = dayjs().year().toString();
        const newActiveSeason = await this.createSeason({
          seasonNumber: currentYear,
          status: "active",
        });

        return newActiveSeason;
      }

      return season;
    } catch (error) {
      throw error;
    }
  }

  

  public async createActiveSeason() {
    const currentSeason = await this.getActiveSeason()
   
    return currentSeason
  }

  public async closeSeason(dto: CloseSeasonDto) {
    const {seasonNumber } = dto;

    try {
      const season = await SeasonModel.findOne({ seasonNumber });

      if (!season) {
        throw new Error("Season not found");
      }
      // if (season.status !== "active") {
      //   throw new Error("Cannot close non-active season");
      // }

      await season.updateOne({ status: "closed" }, { new: true })
      

      const closedSeason = await SeasonModel.findOne({ seasonNumber });

      await SlipModel.updateMany({ type: "free" });

       await ReservationModel.updateMany(
        { season: closedSeason?._id },
        { type:`${EStatus.CLOSED}`}
      
      );

      return closedSeason;
    } catch (error) {
      throw new Error(`Failed to close season: ${error}`);
    }
  }

  public async sendAnnouncement(dto: AnnouncementDto) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      const numbers = await ReservationModel.find().select('phoneNumber -_id').where({type: `${EStatus.ACTIVE}`})
      const myNumber = [
        { phoneNumber: '+380682740560'}
      ]
    
      const combinedArray = [...numbers, ...myNumber];
      
      
      const client = require('twilio')(accountSid, authToken);
      const parsedDate =  dayjs(dto.date);
      const year = parsedDate.year();
      const month = parsedDate.month();
      const day = parsedDate.date()
      //time
      const parsedTime = dayjs(dto.time);
      const hour = parsedTime.hour();
      const minute = parsedTime.minute();
      const second = parsedTime.second();

      let date = dayjs()
      .year(year)
      .month(month)
      .date(day)
      .hour(hour)
      .minute(minute)
      .second(second)
      .millisecond(0);

      let now = dayjs().add(15, 'minutes');
      const callbacks = combinedArray.map((num) => {       
       if(now.isSameOrAfter(date)){
          return client.messages.create({
            body: dto.message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: num.phoneNumber
          })
        }
         return  client.messages.create({
            body: dto.message,
            sendAt: date.toISOString(),
            scheduleType: 'fixed',
            messagingServiceSid: 'MG9d29fe715372f9bc5e84e57bf7955693',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: num.phoneNumber
          })
      })
      await Promise.allSettled(callbacks)
      return numbers;
    } catch (error) {
      console.log(`${error}`)
    }
  }

}

export default new SeasonService();
