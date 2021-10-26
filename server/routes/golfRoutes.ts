import express from "express";
import {
  createGolf,
  getAllGolf,
  getGolfById,
} from "../controllers/golfControllers";
import { getAllProductReviewById } from "../controllers/reviewControllers";

const router = express.Router();

router.route("/create").post(createGolf);
router.route("/").get(getAllGolf);
router.route("/:id/reviews").get(getAllProductReviewById);
router.route("/:id").get(getGolfById);

export default router;
