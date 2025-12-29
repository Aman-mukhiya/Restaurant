import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Menu } from "../models/menu.model.js";

export const createMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin) {
    throw new ApiError(401, "Unauthorized access");
  }

  const newMenu = {
    name: req.body.name,
    description: req.body.description,
    picture: req.file?.path || "",
  };

  const menuExists = await Menu.findOne({ name: newMenu.name });

  if (menuExists) {
    throw new ApiError(400, "Menu with current this name already exists!");
  }

  const createdMenu = await Menu.create(newMenu);

  if (!createdMenu) {
    throw new ApiError(500, "Something went wrong whie creating menu");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdMenu, "Menu created successfully"));
});

export const updateMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id } = req.params;

  const newMenu = {
    name: req.body.name,
    description: req.body.description,
    picture: req.file?.path || "",
  };

  //   const currentMenu = await Menu.findById(id);

  //   if (!currentMenu) {
  //     throw new ApiError(400, "Menu with the given id doesn't exists");
  //   }

  const updatedMenu = await Menu.findByIdAndUpdate(
    id,
    { $set: newMenu },
    { new: true }
  );

  if (!updatedMenu) {
    throw new ApiError(500, "Something went wrong while updating the menu");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedMenu, "Menu updated successfully!!!"));
});

export const deleteMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id } = req.params;

  const deletedMenu = await Menu.findByIdAndDelete(id);

  if (!deletedMenu) {
    throw new ApiError(500, "Something went wrong while deleting menu");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, null, "Menu deleted successfully"));
});

export const getMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && !req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id } = req.params;

  const menu = await Menu.findById(id);

  if (!menu) {
    throw new ApiError(500, "Something went wrong while finding menu");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, menu, "Menu found successfully"));
});

export const getAllMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && !req.employee) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { page = 1, limit = 10, search = "", sortType = "asc" } = req.query;

  const query = { name: { $regex: search, $options: "i" } };

  const allMenu = await Menu.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : 0 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (allMenu.length == 0) {
    throw new ApiError(400, "Nothing found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, allMenu, "Search found successfully!!!"));
});
