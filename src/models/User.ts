import { model, Schema, Document } from "mongoose";

interface User extends Document{
  name: string
  phone: string
  role: string
  phoneOtp?: string
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    phoneOtp: String,
  },
  { timestamps: true }
);

export default model<User>("User", userSchema);
