import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import productRouter from "./routes/products";
import cartRouter from "./routes/cart";
import orderRouter from "./routes/order";

dotenv.config();
const app = express();
if (process.env.MONGODB_URL) {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("mongodb database connection established");
    })
    .catch((err) => {
      console.log(
        "something wrong with the connection to mongodb the error is" + err
      );
    });
}
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
