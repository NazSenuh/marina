import mongoose, { Schema } from "mongoose";
import { EStatus, IReservation } from "../types";

export const Reservation = new mongoose.Schema<IReservation>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  boatName: { type: String, required: false },
  draft:{ type: String, required:false},
  powerSource:{ type: String, required:false},
  boatLength: { type: String, required: true },
  boatWidth: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: String, required: true },
  type:{type:String, required: true},
  slip: { type: Schema.Types.ObjectId, ref: "Slip" },
  season: { type: Schema.Types.ObjectId, ref: "Season" },
});

export const ReservationModel = mongoose.model("Reservation", Reservation);
