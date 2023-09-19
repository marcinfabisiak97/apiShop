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
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRouter = (0, express_1.Router)();
dotenv_1.default.config();
authRouter.post("/register", async (req, res) => {
    const existingUser = await User_1.default.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (existingUser) {
        return res
            .status(400)
            .json({ message: "Username or email already exists" });
    }
    const newUser = new User_1.default({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: crypto_js_1.default.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET || "incorrect password"),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const user = await User_1.default.findOne({
            username: req.body.username,
        });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Incorrect username or password" });
        }
        let hashedPassword = crypto_js_1.default.AES.decrypt(user.password, process.env.PASSWORD_SECRET || "");
        let userPassword = hashedPassword.toString(crypto_js_1.default.enc.Utf8);
        if (userPassword !== req.body.password) {
            return res
                .status(401)
                .json({ message: "Incorrect username or password" });
        }
        if (process.env.JWT_SECRET === undefined) {
            return res
                .status(401)
                .json({ message: "Please set JWT_SECRET env variable" });
        }
        else {
            const accessToken = jsonwebtoken_1.default.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "3d" });
            const _a = user.toObject(), { password } = _a, others = __rest(_a, ["password"]);
            res.status(200).json({ others, accessToken });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "There was a problem logging in. Please try again later.",
        });
    }
});
exports.default = authRouter;
