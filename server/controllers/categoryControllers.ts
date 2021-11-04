import asyncHandler from "express-async-handler";

import { Category } from "../models/categoryModel";

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

const getCategoryList = asyncHandler(async (req, res) => {
  const categoryList = req.body.categoryList;
  // const matchResult = await Category.aggregate([
  //   { $match: { $or: [...categoryList] } },
  //   {
  //     $lookup:{
  //       localField:
  //     }
  //   }
  // ]);

  const categories = await Category.find({
    name: { $in: categoryList },
  }).populate({ path: "products.golf" });

  res.status(200).json(categories);
});

export { getAllCategory, getCategoryList };
