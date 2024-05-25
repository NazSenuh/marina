import { it } from "node:test";
import { CreateReservationDto } from "../dto/create-reservation";
import { ReservStatysticModel, ReservationModel } from "../model/reservation.model";
import { EStatus, ICsv, IReservation } from "../types";
import { Document, Types } from "mongoose";
import slipService from "../../slips/service/slip.service";
import { SlipModel } from "../../slips/model/slip.model";
import { EType } from "../../slips/types";

class ReservationService {
  public async createReservation(dto: IReservation) {

    return await ReservationModel.create({ ...dto });
  }
  public async reservStatystic(time: string) {
    const hourDoc = await ReservStatysticModel.findOne({hour:`${time}:00`})
    if(hourDoc){
      await hourDoc.updateOne({$inc: {count: 1}}) 
    }else{
      await ReservStatysticModel.create({hour:`${time}:00`, count: 1})
    }
  }
  public async getReservStatystic() {
    return ReservStatysticModel.find();
  }
  public async getAllReservations() {
    return ReservationModel.find();
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

  public async deleteSomeReservation() {
    await ReservationModel.deleteMany();
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

    const headers = ['Ім\'я','Телефон', 'Тривалість парковки', "Ціна"]
    data.push(headers.join(','))



    for (const item of result) {
      const parkingDuration = `${item.startDate} X ${item.endDate}`

      const currentRow = [item.fullName, item.phoneNumber,  parkingDuration,item.price]
      data.push(currentRow.join(','))
    }

    return Buffer.from(data.join('\n'))
  }
}
export default new ReservationService();
