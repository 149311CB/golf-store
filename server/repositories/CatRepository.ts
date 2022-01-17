import {
  Document,
  FilterQuery,
  Model,
  model,
  PopulateOptions,
  Schema,
} from "mongoose";
import { ICartInterface, IItemInterface } from "../types/cartType";
import { GolfRepository, VariantRepository } from "./GolfRepository";

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
    GolfRepository.getInstance();
    VariantRepository.getInstance();
    this.model = model<ICartInterface>("CartBadge", this.cartSchema, "carts");
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
    query: FilterQuery<ICartInterface> = {},
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<(ICartInterface & Document<any, any, ICartInterface>)[]> {
    return await this.model.find(query).populate(options);
  }

  async updateInfo(
    cart: ICartInterface & Document<any, any, ICartInterface>
  ): Promise<ICartInterface | null> {
    return await cart.save();
  }
}

export default CartRepository;
