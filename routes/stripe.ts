import { Router } from "express";
import Stripe from "stripe";
const stripeRouter = Router();
const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2022-11-15",
});
stripeRouter.post("/payment", async (req, res) => {
  try {
    const stripeRes = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "pln",
    });
    res.status(200).json(stripeRes);
  } catch (stripeErr) {
    res.status(500).json(stripeErr);
  }
});
const createCustomer = async () => {
  const params: Stripe.CustomerCreateParams = {
    description: "test customer",
  };

  const customer: Stripe.Customer = await stripe.customers.create(params);

  console.log(customer.id);
};
createCustomer();
export default stripeRouter;
