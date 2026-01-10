import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { Order } from "../models/order.model.js";
import { Buffer } from "../models/buffer.model.js";
import { History } from "../models/history.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee?.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const waiterId = req.employee?._id || req.admin?._id;
  const items = req.body.items; // [{menuId , quantity}]
  const table = req.body.table;

  // const formattedItems = items.map((item) => ({
  //   menu: item.menu,
  //   quantity: item.quantity,
  //   waiter: waiterId,
  // }));

  let formattedItems = [];

  items.forEach(({ menu, quantity }) => {
    const objectMenuId = new mongoose.Types.ObjectId(menu);
    for (let i = 0; i < quantity; i++) {
      formattedItems.push({ menu: objectMenuId, waiter: waiterId });
    }
  });

  // console.log("This is the order being sent: ", formattedItems)

  const newOrder = {
    table,
    items: formattedItems,
  };

  // console.log("This is the order being sent: ", newOrder.items);

  // ADD A CHECK FOR SAME TABLE NO.

  const createdOrder = await Order.create(newOrder);

  if (!createdOrder) {
    throw new ApiError(500, "Something went wrong while creating order!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdOrder, "created order successfully!!!"));
});

export const addOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const { id } = req.params;

  const orderId = id;

  console.log("This is the order id: ", orderId);

  const waiterId = req.employee?._id || req.admin?._id;
  const items = req.body.items;
  // const table = req.body.table;

  console.log("This is the waiter id: ", waiterId);

  let formattedItems = [];

  items.forEach(({ menu, quantity }) => {
    const objectMenuId = new mongoose.Types.ObjectId(menu);
    for (let i = 0; i < quantity; i++) {
      formattedItems.push({ menu: objectMenuId, waiter: waiterId });
    }
  });

  const orderAdded = await Order.findByIdAndUpdate(
    orderId,
    { $push: { items: { $each: formattedItems } } },
    {
      new: true,
      projection: {
        items: { $slice: -formattedItems.length },
      },
    }
  );

  // console.log("This is the create order: ", orderAdded);

  if (!createdOrder) {
    throw new ApiError(500, "Something went wrong while creating order!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, orderAdded, "Added order successfully!!!"));
});

export const allTableOrders = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const tableId = req.body.table;

  const allOrder = await Order.find({
    table: Number(tableId),
    "orderClear.status": false,
    "settlement.status": false,
  })
    .select("items.menu items.status items._id")
    .sort({ createdAt: -1 });

  if (allOrder.length == 0) {
    throw new ApiError(400, "No items found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, allOrder, "Orders fetched successfully"));
});

export const kitchenOrdersView = asyncHandler(async (req, res) => {
  if (!req.admin && req.employee.role != "cook") {
    throw new ApiError(500, "Unauthorized access");
  }

  const tableId = req.body.table;

  const allOrder = await Order.aggregate([
    {
      $match: {
        table: Number(tableId),
        "orderClear.status": false,
        "settlement.status": false,
      },
    },
    {
      $project: {
        table: 1,
        items: {
          $filter: {
            input: "$items",
            cond: {
              $in: ["$$this.status", ["pending"]],
            },
          },
        },
      },
    },
  ]);

  if (allOrder.length == 0) {
    throw new ApiError(400, "No items found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, allOrder, "Orders fetched successfully"));
});

export const singleOrderView = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && !req.employee) {
    throw new ApiError(500, "Unauthorized access");
  }

  const tabaleId = req.body.table;
  const { id } = req.params;
  const itemId = id;

  const order = await Order.findOne(
    {
      table: Number(tabaleId),
      "orderClear.status": false,
      "settlement.status": false,
      "items._id": itemId,
    },
    {
      items: { $elemMatch: { _id: itemId } },
      // "items.menu": 1,
      // "items.waiter": 1,
      // "items.cook": 1,
      // "items.status": 1,
    }
  );

  if (order.length == 0) {
    throw new ApiError(500, "No order found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, order, "order found successfully!!!"));
});

// status would be from [faulty , cancelled]
export const deleteOrderWaiter = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }
  const tableId = req.body.table;
  const { id } = req.params;
  const itemId = id;

  const deletedOrder = await Order.findOneAndUpdate(
    {
      table: Number(tableId),
      "orderClear.status": false,
      "settlement.status": false,
      "items._id": itemId,
    },
    {
      $pull: { items: { _id: itemId } },
    },
    {
      new: true,
    }
  );

  if (!deletedOrder) {
    throw new ApiError(500, "Something went wrong while deleting order");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        deletedOrder,
        "Order deleted by waiter successfully!!!"
      )
    );
});

// status would be from [rejected, accepted, cooked]
export const changeStatusCook = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "cook") {
    throw new ApiError(500, "Unauthorized access");
  }

  const tableId = req.body.table;
  const { id } = req.params;
  const itemId = id;
  const statusValue = req.body.status;

  const updatedOrder = await Order.findOneAndUpdate(
    {
      table: Number(tableId),
      "orderClear.status": false,
      "settlement.status": false,
      "items._id": itemId,
    },
    {
      $set: { "items.$.status": statusValue },
    },
    {
      new: true,
      projection: {
        items: { $elemMatch: { _id: itemId } },
      },
    }
  );

  if (!updatedOrder) {
    throw new ApiError(500, "Something went wrong while updating");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        updatedOrder,
        "Order status changed by cook successfully!!!"
      )
    );
});

export const clearOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const { id } = req.params;

  const waiterId = req.employee?._id || req.admin?._id;



  const clearedOrder = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        orderClear: {
          status: true,
          waiter: waiterId,
        },
      },
    },
    { new: true }
  );

  // const clearedOrder = await Order.findById(orderId);

  if (!clearedOrder) {
    console.log("This is the clear order data :", clearedOrder);
    throw new ApiError(500, "Something went wrong while clearing order");
  }

  const bufferData = clearedOrder.toObject();

  delete bufferData._id;

  const newBufferData = await Buffer.create(bufferData);

  if (!newBufferData) {
    throw new ApiError(
      500,
      "Something wenet wrong while creating the buffer data"
    );
  }

  const deleteOrder = await Order.findByIdAndDelete(id);

  if (!deleteOrder) {
    throw new ApiError(500, "Something went wrong while deleting the order");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, deleteOrder, "Order cleared successfully!!!"));
});

export const clearOrderView = asyncHandler(async (req, res) => {
  if (!req.admin && req.employee.role != "reception") {
    throw new ApiError(500, "Unauthorized access");
  }

  const allClearOrder = await Buffer.find();

  if (!allClearOrder) {
    throw new ApiError(404, "No order found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allClearOrder,
        "All cleared order found successfully!!!"
      )
    );
});

export const settleOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "reception") {
    throw new ApiError(500, "Unauthorized access");
  }

  const { id } = req.params;
  const orderId = id;

  const receptionId = req.employee?._id || req.admin?._id;

  const bufferOrder = await Buffer.findByIdAndUpdate(
    orderId,
    {
      $set: {
        settlement: {
          status: true,
          reception: receptionId,
        },
      },
    },
    { new: true }
  );

  if (!bufferOrder) {
    throw new ApiError(500, "Something went wrong while settling order");
  }

  const historyData = bufferOrder.toObject();

  delete historyData._id;

  const newHistory = await History.create(historyData);

  if (!newHistory) {
    throw new ApiError(
      500,
      "Something went wrong while creating the histroy data"
    );
  }

  const deleteData = await Order.findByIdAndDelete(orderId);

  return res
    .status(200)
    .json(new ApiResponse(201, newHistory, "Order settled successfully!!!"));
});
