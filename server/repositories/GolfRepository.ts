import { model, Schema } from "mongoose";
import {
  IFlex,
  IHand,
  ILoft,
  IProduct,
  IShaft,
  IVariant,
} from "../types/productTypes";

const handSchema = new Schema<IHand>({
  side: {
    type: String,
    required: true,
  },
});

const loftSchema = new Schema<ILoft>({
  type: {
    type: Number,
    required: true,
    unique: true,
  },
});

const shaftSchema = new Schema<IShaft>({
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

const flexSchema = new Schema<IFlex>({
  type: {
    type: String,
    required: true,
    unique: true,
  },
});

const variantSchema = new Schema<IVariant>({
  golf: {
    type: Schema.Types.ObjectId,
    ref: "Golf",
    required: true,
  },
  hand: {
    type: Schema.Types.ObjectId,
    ref: "Hand",
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


const golfSchema = new Schema<IProduct>({
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

const GolfRepository = model<IProduct>("Golf", golfSchema, "golfs");
const VariantRepository = model<IVariant>("Variant", variantSchema, "variants");
const FlexRepository = model<IFlex>("Flex", flexSchema, "flexs");
const ShaftRepository = model<IShaft>("Shaft", shaftSchema, "shafts");
const LoftRepository = model<ILoft>("Loft", loftSchema, "lofts");
const HandRepository = model<IHand>("Hand", handSchema, "hands");

export {
  GolfRepository,
  VariantRepository,
  HandRepository,
  LoftRepository,
  ShaftRepository,
  FlexRepository,
};
