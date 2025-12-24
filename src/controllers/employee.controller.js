import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateRefreshTokenAndAccessToken = async (employeeId) => {
  // generateAccessToken
  const EmployeeObject = await Employee.findById(employeeId);

  if (!EmployeeObject) {
    throw new ApiError(
      500,
      "Unable to access Employee Object while creating accessToken and refreshToken"
    );
  }

  const accessToken = await EmployeeObject.generateAccessToken();
  const refreshToken = await EmployeeObject.generateRefreshToken();

  if (!(accessToken && refreshToken)) {
    throw new ApiError(
      500,
      "Something went wrong while creataing accessToken and refreshToken"
    );
  }

  EmployeeObject.refreshToken = refreshToken;
  await EmployeeObject.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const loginEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const EmployeeName = req.body.name;
  const EmployeePassword = req.body.password;

  const checkEmployee = await Employee.findOne({ name: EmployeeName });

  if (!checkEmployee) {
    throw new ApiError(400, "No Employee found with this name");
  }

  const isEmployeePasswordCorrect = await checkEmployee.isPasswordCorrect(
    EmployeePassword
  );

  if (!isEmployeePasswordCorrect) {
    throw new ApiError(401, "Incorrect credentials");
  }

  const { refreshToken, accessToken } =
    await generateRefreshTokenAndAccessToken(checkEmployee._id);

  const loggedInEmployee = await Employee.findById(checkEmployee._id);

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(201, loggedInEmployee, "Employee logged in successfully")
    );
});

export const logoutEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.access == "employee") {
    throw new ApiError(400, "Unauthorized to logout");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Employee Logged out"));
});

export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.access == "employee") {
    throw new ApiError(400, "Unauthorized to get profile");
  }

  const id = req.employee._id;

  const employee = await Employee.findById(id);

  if (!employee) {
    throw new ApiError(500, "Something went wrong while reteriving Employee");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, employee, "Employee retrived successfully!!!"));
});
