import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import Controller, { Methods } from "../typings/Controller";
import { calculatePrice } from "../utils/paymentUtils";
import {jwtValidate} from "../middlewares/authMiddleware";

export default class PaymentController extends Controller {
  public path = "/api/payment";
  protected routes = [
    {
      path: "/auth/stripe",
      method: Methods.GET,
      handler: this.stripe,
      localMiddlewares: [jwtValidate, calculatePrice],
    },
    {
      path: "/auth/paypal",
      method: Methods.GET,
      handler: this.paypal,
      localMiddlewares: [jwtValidate, calculatePrice],
    },
  ];

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

  async paypal(req: Request, res: Response, _: NextFunction) {
    const paypal_secret = process.env.PAYPAL_CLIENT_SECRET;

    const items = req.body;

    const amount = items.total;

    res.json({ clientId: paypal_secret, amount: amount });
  }
}
