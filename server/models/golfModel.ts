import { Schema, model } from "mongoose";
import { golfInterface } from "../types/golfType";

const golfSchema = new Schema<golfInterface>({
  name: {
    type: String,
    required: true,
  },
  longname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  loft: {
    type: Array,
    required: true,
  },
  shaft: {
    type: Array,
    required: true,
  },
  flex: {
    type: Array,
    required: true,
  },
  sku: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
  },
});

const Golf = model<golfInterface>("Golf", golfSchema, "golf");

export default Golf;
