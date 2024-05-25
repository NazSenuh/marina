import mongoose, { Schema } from "mongoose";
import { EStatus, IReservation, IStatystic } from "../types";

export const Reservation = new mongoose.Schema<IReservation>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
 
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  slip: { type: Schema.Types.ObjectId, ref: "Slip" },
});

export const ReservStatystic = new mongoose.Schema<IStatystic>({
  hour: { type: String, required: false },
  count: { type: Number, required: false },
});

export const ReservationModel = mongoose.model("Reservation", Reservation);
export const ReservStatysticModel = mongoose.model("ReservStatystic", ReservStatystic);
