"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("./verifyToken");
const Cart_1 = __importDefault(require("../models/Cart"));
const cartRouter = (0, express_1.Router)();
//create cart
cartRouter.post("/", verifyToken_1.verifyToken, async (req, res) => {
    const newCart = new Cart_1.default(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//update cart
cartRouter.put("/:id", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedCart);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//delete cart
cartRouter.delete("/:id", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get user cart by id
cartRouter.get("/find/:userId", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart_1.default.findOne({ userId: req.params.userId });
        if (cart) {
            res.status(200).json(cart);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get all
cartRouter.get("/", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart_1.default.find();
        res.status(200).json(carts);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = cartRouter;
