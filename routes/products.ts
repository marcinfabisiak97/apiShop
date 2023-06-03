import { Router } from "express";
import { verifyTokenAndAdmin } from "./verifyToken";
import Product from "../models/Product";
const productsRouter = Router();

// productsRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().sort({ _id: -1 }).limit(5)
//       : await User.find();
//     if (users) {
//       res.status(200).json(users);
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// export default productsRouter;
