import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: "Golf",
    required: true,
  },
});

const CategoryRepository = model("Category", categorySchema, "categories");

export { CategoryRepository };
