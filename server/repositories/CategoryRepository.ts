import { Document, Model, model, PopulateOptions, Schema } from "mongoose";
import { GolfRepository } from "./GolfRepository";

class CategoryRepository {
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
  private static instance: CategoryRepository;

  private constructor() {
    GolfRepository.getInstance();
    this.model = model("Category", this.categorySchema, "categories");
  }

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async all(
    query: any,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<any & Document<any, any, any>> {
    return await this.model.find(query).populate(options);
  }
}

export { CategoryRepository };
