import { model, Schema } from "mongoose";
import { ICartInterface, IItemInterface } from "../types/cartType";

const itemSchema = new Schema<IItemInterface>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Golf",
    required: true,
  },
  variant: {
    type: Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema<ICartInterface>({
  user: {
    type: Schema.Types.ObjectId,
  },
  products: [itemSchema],
  isActive: {
    type: Boolean,
    required: true,
  },
});

const CartRepository = model<ICartInterface>("CartBadge", cartSchema, "carts");

export default CartRepository;
