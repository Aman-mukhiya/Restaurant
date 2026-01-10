import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { History } from "../models/history.model.js";

export const getAllHistory = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const { page = 1, limit = 10, sortType = "asc" } = req.query;

  const allHistory = await History.find()
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!allHistory) {
    throw new ApiError("Something went wrong while getting history!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, allHistory, "Retrived all history successfully!!!")
    );
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteId = id;

  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const deletedHistory = await History.findByIdAndDelete(deleteId);

  if (!deletedHistory) {
    throw new ApiError(500, "Something went wrong while deleting hisotyr");
  }

  return res
    .status(200)
    .json(new ApiResponse("History deleted successfully!!!"));
});

// by the given waiter id search the clear hisotry
export const cleredHistory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const { id } = req.params;
  const waiterId = id;
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    sortType = "asc",
  } = req.query;

  const query = {
    "orderClear.waiter": waiterId,
  };

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const allHistory = await History.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (!allHistory) {
    throw new ApiError(404, "Nothing found!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, allHistory, "Clered History found successfully!!!")
    );
});

// by the given the reeption  id search the clear hisotry
export const settledHistory = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const { id } = req.params;
  const receptionId = id;
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    sortType = "asc",
  } = req.query;

  const query = {
    "settlement.reception": receptionId,
  };

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const allHistory = await History.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (!allHistory) {
    throw new ApiError(404, "Nothing found!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, allHistory, "Clered History found successfully!!!")
    );
});

// by the given waiter id search the order given history
export const waiterHistory = asyncHandler(async (req, res) => {
     const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const { id } = req.params;
  const waiterId = id;
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    sortType = "asc",
  } = req.query;

  const query = {
    "items.waiter": waiterId
  };

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const allHistory = await History.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (!allHistory) {
    throw new ApiError(404, "Nothing found!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, allHistory, "order taken History by waiter found successfully!!!")
    );
});

// by the given cook id search the order taken history
export const cookHistory = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  if (!req.admin) {
    throw new ApiError(429, "Unauthorized access");
  }

  const { id } = req.params;
  const cookId = id;
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    sortType = "asc",
  } = req.query;

  const query = {
    "items.waiter": cookId
  };

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const allHistory = await History.find(query)
    .sort({ createdAt: sortType === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (!allHistory) {
    throw new ApiError(404, "Nothing found!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, allHistory, "order accepted History by cook found successfully!!!")
    );
});
