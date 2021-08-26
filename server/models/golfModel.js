import mongoose from "mongoose";

const golfSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  loft: {
    type: Array,
    required: true,
  },
  shaft: {
    type: Array,
    required: true,
  },
  flex: {
    type: Array,
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

const Golf = mongoose.model("Golf", golfSchema, "golf");

export default Golf;
