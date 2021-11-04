import { Schema, model } from "mongoose";

const golfRef = new Schema({
  golf: {
    type: Schema.Types.ObjectId,
    ref: "Golf",
    required: true,
  },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: {
    type: [golfRef],
    required: true,
  },
});

const Category = model("Category", categorySchema, "categories");

export { Category };
