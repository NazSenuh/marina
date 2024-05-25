import { Schema } from "mongoose";

export interface IReservation {
  fullName: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  price: string;
  type: string;
  slip: Schema.Types.ObjectId;
}

export interface IStatystic {
  hour: string;
  count: number;
}

export enum EStatus{
  ACTIVE='active',
  CLOSED='closed',
  CANSELED='canceled'
}

export interface ICsv {
  id: string
}
