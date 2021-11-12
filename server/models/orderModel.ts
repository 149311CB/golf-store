import { model, Schema } from "mongoose";
import { orderInterface } from "../types/orderType";

const orderSchema = new Schema<orderInterface>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Golf",
      required: true,
    },
    state: {
      type: String,
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
  },
  { timestamps: true }
);

const Order = model<orderInterface>("Order", orderSchema, "orders");

export default Order;
