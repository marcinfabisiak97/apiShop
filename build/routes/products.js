"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("./verifyToken");
const Product_1 = __importDefault(require("../models/Product"));
const productsRouter = (0, express_1.Router)();
//add product
productsRouter.post("/", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product_1.default(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//update product
productsRouter.put("/:id", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//delete product
productsRouter.delete("/:id", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json("Product deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get  products by id
productsRouter.get("/find/:id", async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get all products
productsRouter.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product_1.default.find().sort({ createdAt: -1 }).limit(1);
        }
        else if (qCategory) {
            products = await Product_1.default.find({ categories: { $in: [qCategory] } });
        }
        else {
            products = await Product_1.default.find();
        }
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = productsRouter;
