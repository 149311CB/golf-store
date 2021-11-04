import express from "express";
import {
  getAllCategory,
  getCategoryList,
} from "../controllers/categoryControllers";

const router = express.Router();

router.route("/").get(getAllCategory);
router.route("/list").post(getCategoryList);

export default router;
