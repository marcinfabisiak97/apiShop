import { Router, Request, Response } from "express";
import Stripe from "stripe";

const stripeRouter: Router = Router();
const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2022-11-15",
});

stripeRouter.post("/payment", async (req: Request, res: Response) => {
  try {
    const stripeRes: Stripe.Charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "pln",
    });

    res.status(200).json(stripeRes);
  } catch (stripeErr) {
    res.status(500).json("This " + stripeErr);
  }
});

export default stripeRouter;
