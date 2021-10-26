import { Schema, model } from "mongoose";
import {
  golfInterface,
  loftInterface,
  flexInterface,
  shaftInterface,
} from "../types/golfType";

const variantsRef = new Schema({
  variant: {
    type: Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
});

const loftSchema = new Schema({
  type: {
    type: Number,
    required: true,
    unique: true,
  },
});

const flexSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
});

const flexRef = new Schema({
  type:{
    type:Schema.Types.ObjectId,
    required:true
  }
})

const shaftSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const optionSchema = new Schema({
  hand: {
    type: String,
    enum: ["right", "left"],
    default: "right",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const variantSchema = new Schema({
  golf: {
    type: Schema.Types.ObjectId,
    ref: "Golf",
    required: true,
  },
  hand: {
    type: String,
    enum: ["right", "left", "both"],
    default: "both",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  loft: {
    type: Schema.Types.ObjectId,
    ref: "Loft",
  },
  shaft: {
    type: Schema.Types.ObjectId,
    ref: "Shaft",
  },
  flex: {
    type: Schema.Types.ObjectId,
    ref: "Flex",
  },
});


const golfSchema = new Schema<golfInterface>({
  name: {
    type: String,
    required: true,
  },
  longname: {
    type: String,
  },
  price: {
    type: Number,
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

const Loft = model("Loft", loftSchema, "lofts");
const Shaft = model("Shaft", shaftSchema, "shafts");
const Flex = model("Flex", flexSchema, "flexs");
const Variant = model("Variant", variantSchema, "variants");
const Golf = model("Golf", golfSchema, "golfs");

export { Golf, Variant, Loft, Shaft, Flex };
