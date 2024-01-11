import { it } from "node:test";
import { CreateReservationDto } from "../dto/create-reservation";
import { ReservationModel } from "../model/reservation.model";
import { EStatus, ICsv, IReservation } from "../types";
import { Document, Types } from "mongoose";
import slipService from "../../slips/service/slip.service";
import { SlipModel } from "../../slips/model/slip.model";
import { EType } from "../../slips/types";

class ReservationService {
  public async createReservation(dto: IReservation) {
    return await ReservationModel.create({ ...dto });
  }
  public async getAllReservations() {
    return ReservationModel.find().populate("season");
  }
  public async modifyReservations(code: any, data: Partial<IReservation>) {
    const filter = {slip: code, type: EStatus.ACTIVE};

    const updatedReservation =  await ReservationModel.updateMany(filter, data);
    return updatedReservation
  }

  public async findreservation(code: string) {
    return await ReservationModel.find().populate({ path: "slip" });
  }

  public async deleteAllReservations(ids:string[]) {

    for (let i = 0;  i < ids.length; i++){
      await ReservationModel.findOneAndDelete({ _id: ids[i] })
      const slip = await SlipModel.findOne().where({reservations:ids[i]})
      if(slip?.code){
        slipService.modifySlip(slip?.code, {type: EType.FREE})
      }
    }
  }

  public async generateCsv(ids: string[]) {
    let result: (Document<unknown, {}, IReservation> & IReservation & {
      _id: Types.ObjectId;
    })[]
    if(ids.length){
      result = await ReservationModel.find({_id: {"$in": ids}})

      result.sort((a, b) => {
        return ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString());
      });

    }else{
      result = await ReservationModel.find()
    }
    const data: string[] = []

    const headers = ['Full Name','Phone Number', 'Email', 'Boat Size', 'Parking Duration', 'Payment Method', "Price", 'Payment Status', 'Reservation Status']
    data.push(headers.join(','))

    for (const item of result) {
      const boatSize = `${item.boatLength} X ${item.boatWidth}`
      const parkingDuration = `${item.startDate} X ${item.endDate}`

      const currentRow = [item.fullName, item.phoneNumber, item.email, boatSize, parkingDuration, item.paymentMethod,item.price, item.status, item.type]
      data.push(currentRow.join(','))
    }

    return Buffer.from(data.join('\n'))
  }
}
export default new ReservationService();
