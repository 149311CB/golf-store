import asyncHandler from "express-async-handler";
import { Golf, Loft, Shaft, Variant, Flex } from "../models/golfModel";
import mongoose from "mongoose";

// @descs   Fetch all golf
// @route   GET /api/golf
// @access  Public
const getAllGolf = asyncHandler(async (req, res) => {
  // const golfs = await Golf.aggregate([
  //   {
  //     $lookup: {
  //       from: "variants",
  //       as: "variants",
  //       let: { indicator_id: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$golf", "$$indicator_id"] },
  //           },
  //         },
  //         { $limit: 1 },
  //       ],
  //     },
  //   },
  // ]);
  const golfs = await Golf.find({});

  res.json(golfs);
});

const getGolfById = asyncHandler(async (req, res) => {
  /* const golf = await Golf.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    { $limit: 1 },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "golf",
        as: "variants",
      },
    },
  ]); */
  const flexs = await Variant.aggregate([
    { $match: { golf: mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: "$flex" } },
    {
      $lookup: {
        from: "flexs",
        localField: "_id",
        foreignField: "_id",
        as: "flex",
      },
    },
    {$unwind:"$flex"}
  ]);

  const shafts = await Variant.aggregate([
    { $match: { golf: mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: "$shaft" } },
    {
      $lookup: {
        from: "shafts",
        localField: "_id",
        foreignField: "_id",
        as: "shaft",
      },
    },
    {$unwind:"$shaft"}
  ]);

  const lofts = await Variant.aggregate([
    { $match: { golf: mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: "$loft" } },
    {
      $lookup: {
        from: "lofts",
        localField: "_id",
        foreignField: "_id",
        as: "loft",
      },
    },
    {$unwind:"$loft"}
  ]);

  const golf = await Golf.findById(req.params.id)
  const variants = await Variant.find({golf:mongoose.Types.ObjectId(req.params.id)}).populate("shaft flex loft");
  const properties = {}
  // @ts-ignore
  properties.shafts = shafts;
  // @ts-ignore
  properties.flexs = flexs;
  // @ts-ignore
  properties.lofts = lofts;
  res.json({ golf, variants });
});

const createGolf = asyncHandler(async (req, res) => {
  const { variants, ...rest } = req.body;

  const golf = await Golf.create(rest);

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const { loft, shaft, flex, ...variantRest } = variant;

    let loftId;
    let shaftId;
    let flexId;

    if (loft) {
      const updatedLoft = await Loft.findOneAndUpdate(
        { type: loft.type },
        { ...loft },
        { new: true, upsert: true, useFindAndModify: false }
      );
      loftId = updatedLoft._id;
    }

    if (shaft) {
      const updatedShaft = await Shaft.findOneAndUpdate(
        {
          name: shaft.name,
        },
        { ...shaft },
        { new: true, upsert: true, useFindAndModify: false }
      );
      shaftId = updatedShaft._id;
    }

    if (flex) {
      const updatedFlex = await Flex.findOneAndUpdate(
        { type: flex.type },
        { ...shaft },
        { new: true, upsert: true, useFindAndModify: false }
      );
      flexId = updatedFlex._id;
    }

    await Variant.create({
      golf: golf._id,
      loft: loftId ? loftId : null,
      shaft: shaftId ? shaftId : null,
      flex: flexId ? flexId : null,
      ...variantRest,
    });
  }

  res.json({ message: "success", golf: golf._id });
});

export { getAllGolf, getGolfById, createGolf };
