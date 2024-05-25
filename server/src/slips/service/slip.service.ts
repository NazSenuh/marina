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

  public async modifyAllSlips() {
    try {
      // Fetch all slips
      const slips = await SlipModel.find();
  
      // Update each slip based on its index
      const updatePromises = slips.map((slip, index) => {
        const finger_pier = index % 2 === 0 ? 'Звичайне' : 'VIP';
        return SlipModel.findByIdAndUpdate(slip._id, { finger_pier }, { new: true });
      });
  
      // Await all update promises
      const updatedSlips = await Promise.all(updatePromises);
  
      return updatedSlips;
    } catch (error) {
      console.error('Error updating slips:', error);
      throw error;
    }
  }
  
}
export default new SlipService();
