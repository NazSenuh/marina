import { Schema, Types } from "mongoose";

export interface IBlockSlip {
  reason: string;
}

export interface ISlip {
  code: string;
  type: EType;
  dock: string;
  finger_pier: string;
  width: string;
  max_size: string;
  blockingReason?: IBlockSlip | null;
  reservations: Types.ObjectId[];
}

export enum EType {
  FREE = "free",
  RESERVED = "reserved",
  BLOCKED = "blocked",
}
