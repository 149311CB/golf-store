import express from "express";
import { getAllGolf, getGolfById } from "../controllers/golfControllers.js";
import { getAllProductReviewById } from "../controllers/reviewControllers.js";

const router = express.Router();

router.route("/").get(getAllGolf);
router.route("/:id/reviews").get(getAllProductReviewById);
router.route("/:id").get(getGolfById);

export default router;
