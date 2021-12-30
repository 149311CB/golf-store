import { Schema, model } from "mongoose";
import { reviewInterface } from "../types/reviewType";

const reviewSchema = new Schema<reviewInterface>({
  golf: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Golf",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

const Review = model("Review", reviewSchema, "reviews");

export default Review;
