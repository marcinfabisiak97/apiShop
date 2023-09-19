"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const stripeRouter = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_KEY || "", {
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
    }
    catch (stripeErr) {
        res.status(500).json("This " + stripeErr);
    }
});
exports.default = stripeRouter;
