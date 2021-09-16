import asyncHandler from "express-async-handler";
import Golf from "../models/golfModel";

// @descs   Fetch all golf
// @route   GET /api/golf
// @access  Public
const getAllGolf = asyncHandler(async (req, res) => {
  const golfs = await Golf.find({});
  res.json(golfs);
});

const getGolfById = asyncHandler(async (req, res) => {
  const golf = await Golf.findOne({ _id: req.params.id });
  res.json(golf);
});

export { getAllGolf, getGolfById };
