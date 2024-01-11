import { Schema } from "mongoose";

export interface IReservation {
  fullName: string;
  phoneNumber: string;
  email: string;
  boatLength: string;
  boatName:string;
  draft:string;
  boatWidth: string;
  startDate: string;
  endDate: string;
  powerSource: string;
  paymentMethod: string;
  price: string;
  status: string;
  type:EStatus;
  seasonNumber: string;
  slip: Schema.Types.ObjectId;
  season: Schema.Types.ObjectId;
}

export enum EStatus{
  ACTIVE='active',
  CLOSED='closed',
  CANSELED='canceled'
}

export interface ICsv {
  id: string
}
