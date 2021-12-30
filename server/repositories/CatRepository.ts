import { Document, Model, model, PopulateOptions, Schema } from "mongoose";
import { ICartInterface, IItemInterface } from "../types/cartType";

class CartRepository {
  itemSchema = new Schema<IItemInterface>({
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

  cartSchema = new Schema<ICartInterface>({
    user: {
      type: Schema.Types.ObjectId,
    },
    products: [this.itemSchema],
    isActive: {
      type: Boolean,
      required: true,
    },
  });

  model: Model<ICartInterface, any, any>;
  private static instance: CartRepository;

  private constructor() {
    this.model = model<ICartInterface>("Cart", this.cartSchema, "carts");
  }

  public static getInstance(): CartRepository {
    if (!CartRepository.instance) {
      CartRepository.instance = new CartRepository();
    }
    return CartRepository.instance;
  }

  async create(cart: ICartInterface): Promise<ICartInterface> {
    return await this.model.create(cart);
  }

  async findOne(
    query: any,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<ICartInterface & Document<any, any, ICartInterface>> {
    return await this.model.findOne(query).populate(options);
  }

  async findById(
    id: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<ICartInterface & Document<any, any, ICartInterface>> {
    return await this.model.findById(id).populate(options);
  }

  async all(
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<ICartInterface & Document<any, any, ICartInterface>> {
    return await this.model.find().populate(options);
  }

  async updateInfo(
    cart: ICartInterface & Document<any, any, ICartInterface>
  ): Promise<ICartInterface | null> {
    return await cart.save();
  }
}

export default CartRepository;
