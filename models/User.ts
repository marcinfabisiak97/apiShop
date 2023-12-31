import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    img: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
