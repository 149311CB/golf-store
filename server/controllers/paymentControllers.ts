import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import { calculatePrice } from "../utils/paymentUtils";

// @descs   Stripe endpoint
// @route   POST /api/payment/stripe
// @access  Public
const orderUsingStripe = asyncHandler(async (req, res) => {
  const stripe_secret = process.env.STRIPE_CLIENT_SECRET;
  const stripePaymentHandler = new Stripe(stripe_secret!, {
    apiVersion: "2020-08-27",
  });

  const items = req.body;
  const total = calculatePrice(items.items);

  const paymentIntent = await stripePaymentHandler.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

export { orderUsingStripe };
