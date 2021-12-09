import express from "express";
import {
  orderUsingPaypal,
  orderUsingStripe,
} from "../controllers/paymentControllers";
import { protect } from "../middlewares/authMiddleware";
import { calculatePrice } from "../utils/paymentUtils";

const router = express.Router();

router.route("/stripe").get(protect, calculatePrice, orderUsingStripe);
router.route("/paypal").get(protect,calculatePrice, orderUsingPaypal);

export default router;
