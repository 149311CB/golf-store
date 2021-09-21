import {model, Schema} from "mongoose";
import {orderInterface} from "../types/orderType";
import Golf from "./golfModel";

const orderSchema = new Schema<orderInterface>(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: Golf,
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
            required: true,
        },
    },
    {timestamps: true}
);

const Order = model<orderInterface>("Order", orderSchema, "orders");

export default Order;
