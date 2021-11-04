import { Schema, model } from "mongoose";
import { cartInterface, itemInterface } from "../types/cartType";

const itemSchema = new Schema<itemInterface>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Golf",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const cartSchema = new Schema<cartInterface>({
  user: {
    type: Schema.Types.ObjectId,
  },
  products: [itemSchema],
});

const Cart = model<cartInterface>("Cart", cartSchema, "carts");

export default Cart;
