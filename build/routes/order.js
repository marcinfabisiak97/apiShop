"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("./verifyToken");
const Order_1 = __importDefault(require("../models/Order"));
const orderRouter = (0, express_1.Router)();
//create
orderRouter.post("/", async (req, res) => {
    const newOrder = new Order_1.default(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//update
orderRouter.put("/:id", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//delete
orderRouter.delete("/:id", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json("Order deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get user orders
orderRouter.get("/find/:userId", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.params.userId });
        if (orders) {
            res.status(200).json(orders);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get all
orderRouter.get("/", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order_1.default.find();
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get monthly income
orderRouter.get("/income", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order_1.default.aggregate([
            {
                $match: Object.assign({ createdAt: { $gte: previousMonth } }, (productId && {
                    products: { $elemMatch: { productId } },
                })),
            },
            { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
            { $group: { _id: "$month", total: { $sum: "$sales" } } },
        ]);
        res.status(200).json(income);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
orderRouter.get("/financials", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const financials = await Order_1.default.aggregate([
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
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = orderRouter;
