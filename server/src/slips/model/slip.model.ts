import mongoose, { Schema } from "mongoose"
import { IBlockSlip, ISlip } from "../types";
import { string } from "joi";

const BlockSchema = new mongoose.Schema<IBlockSlip>({
    reason: { type: String, require }
});


export const Slip = new mongoose.Schema({
    code: { type: String, require },
    type: { type: String, require },
    dock: { type: String, require },
    finger_pier: { type: String, require},
    width: { type: String, require},
    max_size: { type: String, require},
    blockingReason: { type: BlockSchema, default: null},
    reservations: [{type: Schema.Types.ObjectId, ref:'Reservation'}]
})

export const SlipModel =  mongoose.model('Slip', Slip)