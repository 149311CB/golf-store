import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";

// @descs Fetch all reviews of a product
// @route GET /api/golf/:id/reviews
// @access Public
const getAllProductReviewById = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ golf: req.params.id });
  res.json(reviews);
});

export { getAllProductReviewById };
