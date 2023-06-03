import { Router } from "express";
const userRouter = Router();
userRouter.get("/usertest", (req, res) => {
  res.send("user test is correct");
});
userRouter.post("/userposttest", (req, res) => {
  const username = req.body.username;
  res.send(username);
});
export default userRouter;
