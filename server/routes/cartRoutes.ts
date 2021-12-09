import express from "express";
import {
  authedAddToCart,
  archivedCart,
  authCountItemInCart,
  getActiveCart,
  removeProductFromCart,
  countItemInCart,
  guestAddToCart,
} from "../controllers/cartControllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/activeCart").post(protect, getActiveCart);
router.route("/guestActiveCart").post(protect, getActiveCart);
router.route("/authAddToCart").post( protect, authedAddToCart);
router.route("/guestAddToCart").post(guestAddToCart);
router.route("/archived").post(archivedCart);
router.route("/authCountItem").post(protect, authCountItemInCart);
router.route("/countItem").post(countItemInCart);
router.route("/removeItem").post(removeProductFromCart);

export default router;
