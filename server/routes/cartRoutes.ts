import express from "express";
import {
  addToCart,
  archivedCart,
  countItemInCart,
  getActiveCart,
  removeProductFromCart,
} from "../controllers/cartControllers";

const router = express.Router();

router.route("/activeCart").post(getActiveCart)
router.route("/addToCart").post(addToCart);
router.route("/archived").post(archivedCart);
router.route("/countItem").post(countItemInCart);
router.route("/removeItem").post(removeProductFromCart);

export default router;
