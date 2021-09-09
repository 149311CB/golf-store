import express from "express";
import { orderUsingStripe } from "../controllers/paymentControllers.js";

const router = express.Router();

router.route("/stripe").post(orderUsingStripe);

export default router;
