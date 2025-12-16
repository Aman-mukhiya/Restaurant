import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    profile: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["waiter", "cook", "reception"],
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateAccessToken = async function(){
  return jwt.sign({
    _id: this.id,
    name: this.name,
    role: this.role,
    phone: this.phone
  },process.env.ACCESS_TOKEN_SCERET,{
    expiresIn: "1d"
  });
}

employeeSchema.methods.generateRefreshToken = async function(){
  return jwt.sign({
    _id: this.id,
  },process.env.REFRESH_TOKEN_SCERET,{
    expiresIn: "7d"
  });
}

export const Employee = mongoose.model("Employee", employeeSchema);
