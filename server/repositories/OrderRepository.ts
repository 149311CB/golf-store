import { FilterQuery } from "mongoose";
import { Document, Model, model, PopulateOptions, Schema } from "mongoose";
import { orderInterface } from "../types/orderType";
import CartRepository from "./CatRepository";

class OrderRepository {
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
        ref: "CartBadge",
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
      shipping: { type: String, required: true },
      total: { type: Number, required: true },
    },
    { timestamps: true }
  );

  model: Model<orderInterface, any, any>;
  private static instance: OrderRepository;

  private constructor() {
    CartRepository.getInstance();
    this.model = model<orderInterface>("Order", this.orderSchema, "orders");
  }

  public static getInstance(): OrderRepository {
    if (!OrderRepository.instance) {
      OrderRepository.instance = new OrderRepository();
    }
    return OrderRepository.instance;
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
    query: FilterQuery<orderInterface> = {},
    options?: PopulateOptions | Array<PopulateOptions>,
    sort?: any,
    limit?: number
  ): Promise<(orderInterface & Document<any, any, orderInterface>)[]> {
    return await this.model
      .find(query)
      .sort(sort)
      .limit(limit)
      .populate(options);
  }

  async updateInfo(
    order: orderInterface & Document<any, any, orderInterface>
  ): Promise<orderInterface | null> {
    return await order.save();
  }
}

export default OrderRepository;
