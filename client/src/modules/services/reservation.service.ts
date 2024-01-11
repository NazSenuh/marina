import {
  IReservation,
  IReservationDisplay,
  ReservationPayload,
} from "../types/marina.types";
import { HttpService } from "./http.service";
import fileDownload from 'js-file-download'

export class ReservationService {
  constructor(private httpService: HttpService) {}
  async getAllReservations() {
    const data: ReservationPayload[] = await this.httpService.get(
      `api/reservations`
    );
    const displayableData:IReservationDisplay[] = data.map(
      (
        {
          _id,
          fullName,
          phoneNumber,
          email,
          boatLength,
          boatWidth,
          startDate,
          endDate,
          paymentMethod,
          status,
          price,
          season,
          type
        },
      ) => ({
        _id,
        fullName,
        phoneNumber,
        email,
        boatSize: `${boatLength} x ${boatWidth}`,
        parkingDuration: `${startDate} - ${endDate}`,
        paymentMethod,
        price,
        status,
        season: season.seasonNumber,
        type
      })
    
    );
    return displayableData;
  }

  async createReservation(code: string, data: IReservation) {
    return this.httpService.post(`api/reservations/${code}`, data, true);
  }

  async cancelReservation(code: string) {
    return this.httpService.patch(`api/reservations/cancel/${code}`, true);
  }

  async generateCsv(ids: string[]) {  
    return this.httpService.post<Buffer, string[]>('api/reservations/generate-csv', ids, true, {responseType: 'arraybuffer'})
  }

  async downloadFile(ids: string[]) {
    const res = await this.generateCsv(ids)
    fileDownload(res, 'reservation.csv')
  }

  async deleteReservation(ids: string[]) {
    return this.httpService.patch(`api/reservations/`,ids, true);
  }
  
}

const reservationService = new ReservationService(new HttpService());
export default reservationService;
