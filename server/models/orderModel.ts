import {
  Document,
  Model,
  model,
  PopulateOptions,
  Schema,
} from "mongoose";
import { orderInterface } from "../types/orderType";

// const Order = model<orderInterface>("Order", orderSchema, "orders");
class Order {
  stateSchema = new Schema(
    {
      state: { type: String, required: true },
    },
    { timestamps: true }
  );
  orderSchema = new Schema<orderInterface>(
    {
      cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
      },
      state: {
        type: this.stateSchema,
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
      stateHistory: [this.stateSchema],
    },
    { timestamps: true }
  );

  model: Model<orderInterface, any, any>;
  private static instance: Order;

  private constructor() {
    this.model = model<orderInterface>("Order", this.orderSchema, "orders");
  }

  public static getInstace(): Order {
    if (!Order.instance) {
      Order.instance = new Order();
    }
    return Order.instance;
  }

  async create(order: orderInterface): Promise<orderInterface | null> {
    return await this.model.create(order);
  }

  async findById(
    id: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<orderInterface & Document<any, any, orderInterface>> {
    return await this.model.findById(id).populate(options);
  }

  async all(
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<orderInterface & Document<any, any, orderInterface>> {
    return await this.model.find().populate(options);
  }

  async updateInfo(
    order: orderInterface & Document<any, any, orderInterface>
  ): Promise<orderInterface | null> {
    return await order.save();
  }
}

export default Order;
