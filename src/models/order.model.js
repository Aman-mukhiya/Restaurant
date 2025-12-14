import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: Number,
      required: true,
      unique: true,
    },
    items: [
      {
        menu: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
        },
        waiter: {
          type: Schema.Types.ObjectId,
          ref: "Employee",
        },
        cook: {
          type: Schema.Types.ObjectId,
          ref: "Employee",
        },
        status: {
          type: String,
          enum: [
            "pending","cooking","reject",
            "fault","cancelled","cooked",
          ],
          default: "pending",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    reception: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
