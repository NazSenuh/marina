import dayjs from "dayjs";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ISeason {
  seasonNumber: string;
  status: string;
}

export interface IAnnouncement {
  message: string;
  date: string;
  time: string;
}


export interface IReservation {
  fullName: string;
  phoneNumber: string;
  email: string;
  boatLength: string;
  boatWidth: string;
  startDate: string;
  endDate: string;
  paymentMethod: ECheckboxCash;
  status: ECheckboxType;
  price: string;
  season: ISeason;
  type?: EStatus
}
export enum EStatus{
  ACTIVE='active',
  CLOSED='closed'
}


export interface ReservationPayload {
  _id: string ;
  fullName: string;
  phoneNumber: string;
  email: string;
  boatLength: string;
  boatWidth: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: string;
  price: string;
  season: ISeason;
  type:string
}

export interface IReservationDisplay {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  boatSize: string;
  parkingDuration: string;
  paymentMethod: string;
  price: string;
  status: string;
  season: string;
  type:string;
  [key: string]: string | number;
}


export interface IEmail {
  email: string;
}

export interface IBboat {
  type: EBoatTypes;
  rotate: boolean;
  dock: EBoatDock;
  code: string;
  handleClick: (code: string) => void;
}

export enum ELogin {
  TOKEN = "token",
}

export enum ESeason {
  ACTIVE_SEASON_NUMBER = "activeSeasonNumber",
}

export interface INewPass {
  password: string;
  confirmPassword: string;
  email: string;
}

export enum EBoatModal {
  FREE = "free",
  RECERVED = "reserved",
  BLOCKED = "blocked",
  BLOCKED_ACTION = "blocked-action",
  RESERVED_ACTION = "recerved-action",
  CANCEL_RESERVATION_ACTION = "cancel-reservation-action",
  CANCEL_BLOCK_ACTION = "cancel-block-action",
}

export enum ECheckboxCash {
  CASH = "cash",
  CARD = "card",
  CHECK = "check",

}
export enum EEngineSource {
  ENGINE = "engine",
  SAIL = "sail",
}

export enum ECheckboxType {
  PARTIALLY_PAID='partially_paid',
  PAID = "paid",
  UNPAID = "unpaid",
  ALL ='all',
  
}

export enum EQueryKeys {
  ALL_SLIP = "all-slips",
  ONE_SLIP = "one-slip",
  ALL_REPORTS = "all-reports",
  IMPORT_CSV = "import-csv",
  GET_LINK = "get-link",


}

export enum EBoatTypes {
  FREE = "free",
  RECERVED = "reserved",
  BLOCKED = "blocked",
}

export enum EBoatDock {
  DockA = "A",
  DockB = "B",
  DockC = "C",
  DockD = "D",
  DockT = "T",
}

export interface IModifyUser {
  email: string;
  link:string;
}

export interface ISlip {
  _id: string;
  dock: EBoatDock;
  code: string;
  width: string;
  type: EBoatTypes;
  max_size: string;
  finger_pier: string;
}

export type ResetPasswordRouteParams = {
  link: string;
};
