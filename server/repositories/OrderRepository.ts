import { model, Schema } from "mongoose";
import { orderInterface } from "../types/orderType";

const stateSchema = new Schema(
  {
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const orderSchema = new Schema<orderInterface>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "CartBadge",
      required: true,
    },
    state: {
      type: stateSchema,
      required: true,
    },
    paymentMethod: {
      type: Object,
      required: true,
    },
    paidAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    stateHistory: [stateSchema],
    shipping: { type: String, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderRepository = model<orderInterface>("Order", orderSchema, "orders");

export default OrderRepository;
