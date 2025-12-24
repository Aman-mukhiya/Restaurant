import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { Employee } from "../models/employee.model.js";

export const auth = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken.replace("Bearer ", "") ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCERET);

    if (!decodedToken) {
      return res.status(401, "Unauthorized access");
    }

    if (decodedToken.access == "employee") {
      const employee = await Employee.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      // console.log("Its employee : "+employee);
      if (!employee)
        return res
          .status(500)
          .json({ message: "Something went wrong while retriving employee" });

      req.employee = employee;
    } else {
      const admin = await Admin.findById(decodedToken._id).select("-password");
      // console.log("Its admin : "+admin);
      if (!admin)
        return res
          .status(500)
          .json({ message: "Something went wrong while retriving admin" });

      req.admin = admin;
    }

    // console.log("Auth is successful");

    next();
  } catch (error) {
    console.log("This is the error :", error);
    return res.status(401).json({ message: "Invalid refresh token!" }, error);
  }
});
