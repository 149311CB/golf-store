import { Schema } from "mongoose";

export interface reviewInterface {
  golf: Schema.Types.ObjectId;
  user: string;
  rating: number;
  comment: string;
}
