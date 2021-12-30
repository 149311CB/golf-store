import {
  Document,
  FilterQuery,
  Model,
  model,
  PopulateOptions,
  QueryOptions,
  Schema,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import {
  IFlex,
  IHand,
  ILoft,
  IProduct,
  IShaft,
  IVariant,
} from "../types/productTypes";

// const Hand = model<IHand>("Hand", handSchema, "hands");
class Hand {
  handSchema = new Schema<IHand>({
    side: {
      type: String,
      required: true,
    },
  });

  private model: Model<IHand, any, any>;
  private static instance: Hand;

  constructor() {
    this.model = model<IHand>("Hand", this.handSchema, "hands");
  }

  public static getInstance(): Hand {
    if (!Hand.instance) {
      Hand.instance = new Hand();
    }
    return Hand.instance;
  }

  async findOne(
    query: any,
    populate?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IHand & Document<any, any, IHand>> {
    return this.model.findOne(query).populate(populate);
  }
}

class Loft {
  loftSchema = new Schema<ILoft>({
    type: {
      type: Number,
      required: true,
      unique: true,
    },
  });

  private model: Model<ILoft, any, any>;
  private static instance: Loft;

  constructor() {
    this.model = model<ILoft>("Lofts", this.loftSchema, "lofts");
  }

  public static getInstance(): Loft {
    if (!Loft.instance) {
      Loft.instance = new Loft();
    }
    return Loft.instance;
  }

  async findOneAndUpdate(
    filter?: FilterQuery<ILoft>,
    update?: UpdateQuery<ILoft> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    populate?: PopulateOptions | Array<PopulateOptions>
  ): Promise<ILoft & Document<any, any, IShaft>> {
    return await this.model
      .findOneAndUpdate(filter, update, options)
      .populate(populate);
  }
}

class Shaft {
  shaftSchema = new Schema<IShaft>({
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

  private model: Model<IShaft, any, any>;
  private static instance: Shaft;

  constructor() {
    this.model = model<IShaft>("Shaft", this.shaftSchema, "shafts");
  }

  public static getInstance(): Shaft {
    if (!Shaft.instance) {
      Shaft.instance = new Shaft();
    }
    return Shaft.instance;
  }

  async findOneAndUpdate(
    filter?: FilterQuery<IShaft>,
    update?: UpdateQuery<IShaft> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    populate?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IShaft & Document<any, any, IShaft>> {
    return await this.model
      .findOneAndUpdate(filter, update, options)
      .populate(populate);
  }
}

class Flex {
  flexSchema = new Schema<IFlex>({
    type: {
      type: String,
      required: true,
      unique: true,
    },
  });

  private model: Model<IFlex, any, any>;
  private static instance: Flex;

  constructor() {
    this.model = model<IFlex>("Flex", this.flexSchema, "flexs");
  }

  public static getInstance(): Flex {
    if (!Flex.instance) {
      Flex.instance = new Flex();
    }
    return Flex.instance;
  }

  async findOneAndUpdate(
    filter?: FilterQuery<IFlex>,
    update?: UpdateQuery<IFlex> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    populate?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IFlex & Document<any, any, IFlex>> {
    return await this.model
      .findOneAndUpdate(filter, update, options)
      .populate(populate);
  }
}

class Variant {
  variantSchema = new Schema<IVariant>({
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

  private model: Model<IVariant, any, any>;
  private static instance: Variant;

  constructor() {
    this.model = model<IVariant>("Variant", this.variantSchema, "variants");
  }

  public static getInstance(): Variant {
    if (!Variant.instance) {
      Variant.instance = new Variant();
    }
    return Variant.instance;
  }

  async create(
    order: IVariant
  ): Promise<IVariant | Document<any, any, IVariant>> {
    return await this.model.create(order);
  }

  async all(
    query: any,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IVariant & Document<any, any, IVariant>> {
    return await this.model.find(query).populate(options);
  }
}

class Golf {
  golfSchema = new Schema<IProduct>({
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

  private model: Model<IProduct, any, any>;
  private static instance: Golf;

  private constructor() {
    this.model = model<IProduct>("Golf", this.golfSchema, "golfs");
  }

  public static getInstance(): Golf {
    if (!Golf.instance) {
      Golf.instance = new Golf();
    }
    return Golf.instance;
  }

  async create(
    order: IProduct
  ): Promise<IProduct | Document<any, any, IProduct>> {
    return await this.model.create(order);
  }

  async findById(
    id: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IProduct & Document<any, any, IProduct>> {
    return await this.model.findById(id).populate(options);
  }

  async all(
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<IProduct & Document<any, any, IProduct>> {
    return await this.model.find().populate(options);
  }

  async updateInfo(
    order: IProduct & Document<any, any, IProduct>
  ): Promise<IProduct | null> {
    return await order.save();
  }
}

export { Golf, Variant, Hand, Loft, Shaft, Flex };
