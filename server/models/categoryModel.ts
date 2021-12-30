import { Document, Model, model, PopulateOptions, Schema } from "mongoose";

class Category {
  golfRef = new Schema({
    golf: {
      type: Schema.Types.ObjectId,
      ref: "Golf",
      required: true,
    },
  });
  categorySchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    products: {
      type: [this.golfRef],
      required: true,
    },
  });

  private model: Model<any, any, any>;
  private static instance: Category;

  private constructor() {
    this.model = model("Category", this.categorySchema, "categories");
  }

  public static getInstance(): Category {
    if (!Category.instance) {
      Category.instance = new Category();
    }
    return Category.instance;
  }

  async all(
    query: any,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<any & Document<any, any, any>> {
    return await this.model.find(query).populate(options);
  }
}

export { Category };
