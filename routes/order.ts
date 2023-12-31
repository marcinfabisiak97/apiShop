import { Router } from "express";
import {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} from "./verifyToken";
import Order from "../models/Order";
const orderRouter = Router();
//create
orderRouter.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update
orderRouter.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete
orderRouter.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user orders
orderRouter.get(
  "/find/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
//get all
orderRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get monthly income
orderRouter.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
orderRouter.get("/financials", verifyTokenAndAdmin, async (req, res) => {
  try {
    const financials = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
          sales: { $sum: 1 },
          costs: { $sum: "$cost" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json(financials);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default orderRouter;
