import { CreateSlipDto } from "../dto/create-slip.dto";
import { ModifySlipDTO } from "../dto/modify-slip.dto";
import { SlipModel } from "../model/slip.model";
import { ISlip } from "../types";

class SlipService {
  public async createSlip(dto: CreateSlipDto) {

    return await SlipModel.create({...dto });
  }

  public async getAll() {
    return SlipModel.find();
  }

  public async deleteAll() {
    return await SlipModel.deleteMany();
  }

  public async getOne(data: string) {
    return await SlipModel.findOne({ code: data }).populate({
      path: "reservations",
    });
  }

  public async modifySlip(code: string, data: Partial<ISlip>) {
    
    const filter = { code };
    const updatedSlip = await SlipModel.findOneAndUpdate(filter, data, {
      new: true,
    });
    return updatedSlip;
  }
  
}
export default new SlipService();
