import express from "express";
import asyncHandler from "express-async-handler";
import { calculatePrice } from "../utils/paymentUtils";

const router = express.Router();

router.route("/").get(
  calculatePrice,
  asyncHandler(async (req, res) => {
    console.log("endpoint");
  })
);

export default router;
