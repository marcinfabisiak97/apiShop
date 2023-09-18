import { Router } from "express";
import User from "../models/User";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const authRouter = Router();
dotenv.config();

authRouter.post("/register", async (req, res) => {
  const existingUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET || "incorrect password"
    ),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    let hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET || ""
    );
    let userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (userPassword !== req.body.password) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
    if (process.env.JWT_SECRET === undefined) {
      return res
        .status(401)
        .json({ message: "Please set JWT_SECRET env variable" });
    } else {
      const accessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user.toObject();
      res.status(200).json({ others, accessToken });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was a problem logging in. Please try again later.",
    });
  }
});
export default authRouter;
