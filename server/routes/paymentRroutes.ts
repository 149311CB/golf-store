import express from "express";
import {orderUsingPaypal, orderUsingStripe} from "../controllers/paymentControllers";
import { calculatePrice } from "../utils/paymentUtils";

const router = express.Router();

router.route("/stripe").get(calculatePrice, orderUsingStripe);
router.route("/paypal").get(calculatePrice, orderUsingPaypal)

export default router;
