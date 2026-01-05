import mongoose, { Schema } from "mongoose";

const bufferSchema = new Schema(
  {
    table: {
      type: Number,
      required: true,
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
        },
      },
    ],
    settlement: {
      status: {
        type: Boolean,
        default: true,
      },
      reception: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
    orderClear: {
      status: {
        type: Boolean,
        default: true,
      },
      waiter: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
  },
  { timestamps: true }
);

export const Buffer = mongoose.model("Buffer", bufferSchema);
