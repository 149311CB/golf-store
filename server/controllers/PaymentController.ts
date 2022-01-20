import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import Controller from "../typings/Controller";
import { calculatePrice } from "../utils/paymentUtils";
import { jwtValidate } from "../middlewares/authMiddleware";
import { routeConfig } from "../middlewares/routeConfig";

export default class PaymentController extends Controller {
  @routeConfig({ method: "get", path: "/api/payment" + "/auth/stripe", middlewares: [jwtValidate, calculatePrice] })
  async stripe(req: Request, res: Response, _: NextFunction) {
    const stripe_secret = process.env.STRIPE_CLIENT_SECRET;
    const stripePaymentHandler = new Stripe(stripe_secret!, {
      apiVersion: "2020-08-27",
    });

    const items = req.body;
    // const total = calculatePrice(items.items);

    const paymentIntent = await stripePaymentHandler.paymentIntents.create({
      amount: items.total * 100,
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }

  @routeConfig({ method: "get", path: "/api/payment" + "/auth/paypal", middlewares: [jwtValidate, calculatePrice] })
  async paypal(req: Request, res: Response, _: NextFunction) {
    const paypal_secret = process.env.PAYPAL_CLIENT_SECRET;

    const items = req.body;

    const amount = items.total;

    res.json({ clientId: paypal_secret, amount: amount });
  }
}
