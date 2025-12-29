import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { Admin } from "../models/admin.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAccessToken = async (adminId) => {
  const AdminObject = await Admin.findById(adminId);

  const accessToken = "Bearer " + (await AdminObject.getAccessToken());

  console.log("This is accessToken :" + accessToken);
  return accessToken;
};

export const registerAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const newAdmin = {
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
  };

  const AdminExists = await Admin.findOne({
    $or: [{ name: newAdmin.name }, { phone: newAdmin.phone }],
  });

  if (AdminExists) {
    throw new ApiError(401, "Admin with this name or phone already exists");
  }

  const createAdmin = await Admin.create(newAdmin);

  if (!createAdmin) {
    throw new ApiError(500, "Something went wrong while creating Admin");
  }

  const AdminObject = await Admin.findById(createAdmin._id).select("-password");

  if (!AdminObject) {
    throw new ApiError(500, "something went wrong while retriving Admin data");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, AdminObject, "Admin created Successfully"));
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, password } = req.body;

  const existsAdmin = await Admin.findOne({ name: name });

  if (!existsAdmin) {
    throw new ApiError(400, "Admin doesn't exists!!!");
  }

  const isPasswordValid = await existsAdmin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Wrong admin Password");
  }

  const accessToken = await getAccessToken(existsAdmin._id);

  const loggedInAdmin = await Admin.findById(existsAdmin._id).select(
    "-password"
  );

  if (!loggedInAdmin) {
    throw new ApiError(500, "Something went wrong while retriving admin data");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(201, { loggedInAdmin }, "Admin logged successfully"));
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  if (req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Admin Logged out"));
});

export const registerEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // console.log(req.file.destination + "/n");
  // console.log(req.file.filename);
  // console.log(req.file.path);
  // console.log(req.file.fieldname);

  if (!req.admin) {
    throw new ApiError(401, "Unauthorized access");
  }

  // console.log("this is file : " + req.file?.path);

  const newEmployee = {
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
    profile: req.file?.path || "",
    role: req.body.role,
  };

  const userExists = await Employee.findOne({
    $or: [{ name: newEmployee.name }, { phone: newEmployee.phone }],
  });

  if (userExists) {
    throw new ApiError(401, "User already exists");
  }

  const createdEmployee = await Employee.create(newEmployee);

  if (!createdEmployee) {
    throw new ApiError(500, "Something went wrong while creating the employee");
  }

  const EmployeeObject = await Employee.findById(createdEmployee._id).select(
    "-password -refreshToken"
  );

  if (!EmployeeObject) {
    return new ApiError(500, "something went wrong while retriving data");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, EmployeeObject, "Employee created successfully!!!")
    );
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id } = req.params;

  // console.log("this is file : " + req.file?.path);

  const newEmployee = {
    name: req.body?.name,
    password: req.body?.password,
    phone: req.body?.phone,
    profile: req.file?.path,
    role: req.body?.role,
  };

  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    { $set: newEmployee },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedEmployee) {
    throw new ApiError(500, "Something went wrong while updateing employee");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, updatedEmployee, "Employee updated successfully!!!")
    );
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id } = req.params;

  const deletedEmployee = await Employee.findByIdAndDelete(id);

  if (!deletedEmployee) {
    throw new ApiError(500, "Something went while deleting the Employee");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, null, "Employee deleted successfully!!!"));
});

export const getAllProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { page = 1, limit = 10, search = "", sortType = "asc" } = req.query;

  // const query = {
  //   $or: [
  //     { name: { $regex: search, $options: "i" } },
  //     { phone: { $regex: Number(search) } },
  //     { role: { $regex: search, $options: "i" } },
  //   ],
  // };
  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ],
  };
  const allEmployee = await Employee.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (allEmployee.length == 0) {
    return res.status(400).json({ message: "Nothing found!" });
  }
  return res
    .status(200)
    .json({ message: "Search founded successfully", Page: page, allEmployee });
});
