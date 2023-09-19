"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const verifyToken_1 = require("./verifyToken");
const crypto_js_1 = __importDefault(require("crypto-js"));
const userRouter = (0, express_1.Router)();
//add user
userRouter.post("/add", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    const newUser = new User_1.default(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//update user
userRouter.put("/:id", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = crypto_js_1.default.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET || "incorrect password").toString();
    }
    try {
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//delete user
userRouter.delete("/:id", verifyToken_1.verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get  user by id
userRouter.get("/find/:id", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (user) {
            const _a = user.toObject(), { password } = _a, others = __rest(_a, ["password"]);
            res.status(200).json(others);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get all users
userRouter.get("/", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User_1.default.find().sort({ _id: -1 }).limit(5)
            : await User_1.default.find();
        if (users) {
            res.status(200).json(users);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get user stats expample users per month
userRouter.get("/stats", verifyToken_1.verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const stats = await User_1.default.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } },
        ]);
        res.status(200).json(stats);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = userRouter;
