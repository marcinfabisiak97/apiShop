import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import productRouter from "./routes/products";
import cartRouter from "./routes/cart";
import orderRouter from "./routes/order";
import stripeRouter from "./routes/stripe";
import sendEmail from "./routes/sendEmail";
import cors from "cors";
dotenv.config();
const app = express();
console.log(process.env.MONGODB_URL)
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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://famous-salmiakki-42778d.netlify.app",
      "https://apishop-at7j.onrender.com",
      "https://sweet-blancmange-037826.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "accessToken"],
  })
);

app.use(express.json());
app.use("/api/", sendEmail);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);
app.listen(5000, () => {
  console.log("backend server is running");
});
