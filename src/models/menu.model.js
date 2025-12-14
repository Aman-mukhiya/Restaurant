import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.modal("Menu", menuSchema);
