import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  golf: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Golf",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

const Review = mongoose.model("Review", reviewSchema, "reviews");

export default Review;
