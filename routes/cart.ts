import { Router } from "express";
import {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} from "./verifyToken";
import Cart from "../models/Cart";
const cartRouter = Router();
//create cart
cartRouter.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update cart
cartRouter.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete cart
cartRouter.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user cart by id
cartRouter.get(
  "/find/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (cart) {
        res.status(200).json(cart);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
//get all
cartRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default cartRouter;
