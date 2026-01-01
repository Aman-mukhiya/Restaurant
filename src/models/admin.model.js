import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.getAccessToken = async function () {
  return jwt.sign(
    {
      _id: this.id,
      phone: this.phone
    },
    process.env.ACCESS_TOKEN_SCERET,
    {
      expiresIn: "1d",
    }
  );
};

// adminSchema.methods.getRefreshToken = async function () {
//   return jwt.sign(
//     {
//       _id: this.id,
//     },
//     process.env.REFRESH_TOKEN_SCERET,
//     {
//       expiresIn: "7d",
//     }
//   );
// };

export const Admin = mongoose.model("Admin", adminSchema);
