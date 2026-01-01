import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { Order } from "../models/order.model.js";
import { History } from "../models/history.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  items.forEach(({menuId, quantity}) => {
    for (let i = 0; i < quantity; i++) {
      formattedItems.push({ menu: menuId, waiter: waiterId });
    }
  });

  const newOrder = {
    table,
    items: formattedItems,
  };
  // ADD A CHECK FOR SAME TABLE NO.

  const createdOrder = await Order.create(newOrder);

  if (!createdOrder) {
    throw new ApiError(500, "Something went wrong while creating order!!!");
  }

  console.log("This is the order created : ", createdOrder)

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

  const { orderId } = req.params;

  const waiterId = req.employee._id || req.admin._id;
  const items = req.body.items;
  const table = req.body.table;

  // const formattedItems = items.map((item) => ({
  //   menu: item.menu,
  //   quantity: item.quantity,
  //   waiter: waiterId,
  // }));

  let formattedItems = [];

  items.foreach((menuId, quantity) => {
    for (let i = 0; i < quantity; i++) {
      formattedItems.push({ menu: menuId, waiter: waiterId });
    }
  });

  const newItem = {
    table,
    items: formattedItems,
  };

  const createdOrder = await Order.findByIdAndUpdate(
    orderId,
    { $push: { items: newItem } },
    {
      new: true,
      projection: {
        items: { $slice: -1 }, // Gets only the last item (the one you just pushed)
        "items.menu": 1,
        "items.status": 1,
      },
    }
  );

  if (!createdOrder) {
    throw new ApiError(500, "Something went wrong while creating order!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdOrder, "Created order successfully!!!"));
});

export const allTableOrders = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const  tableId  = req.body.table;

  const allOrder = await Order.find(
    { 
      table: Number(tableId),
      "orderClear.status": false,  
      "settlement.status": false   
    })
    .select("items.menu items.status")
    .sort({ createdAt: -1 });

  if (allOrder.length == 0) {
    throw new ApiError(400, "No items found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, allOrder, "Orders fetched successfully"));
});

export const kitchenOrdersView = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "cook") {
    throw new ApiError(500, "Unauthorized access");
  }

  const  tableId  = req.body.table;

  const allOrder = await Order.find(
    { 
      table: Number(tableId),
      "orderClear.status": false,  
      "settlement.status": false   
     },
    {
      $project: {
        table: 1,
        items: {
          $filter: {
            input: "$items",
            as: "item",
            cond: {
              $in: ["$$item.status", ["pending"]],
            },
          },
        },
      },
    }
  );

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

  const  tabaleId  = req.body.table;
  const  itemId  = req.body.item;

  const order = await Order.findOne(
    {
      table: Number(tabaleId),
      "orderClear.status": false,  
      "settlement.status": false,
      "items._id": itemId,
    },
    {
      items: { $elemMatch: { _id: itemId } },
      "items.menu": 1,
      "items.waiter": 1,
      "items.cook": 1,
      "items.status": 1,
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
export const changeStatusWaiter = asyncHandler(async (req, res) => { 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const tableId = req.body.table;
  const  itemId  = req.body.item;
  const  statusValue  = req.body.status;

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
        "items.$": 1,
        "items.menu": 1,
        "items.waiter": 1,
        "items.cook": 1,
        "items.status": 1,
      },
    }
  );

  if (!updatedOrder) {
    throw new ApiError(500, "Something went wrong while updating");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedOrder, "Order status changed by waiter successfully!!!"));
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

  const  tableId  = req.body.table;
  const  itemId  = req.body.item;
  const  statusValue  = req.body.status;

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
        "items.$": 1,
        "items.menu": 1,
        "items.waiter": 1,
        "items.cook": 1,
        "items.status": 1,
      },
    }
  );

  if (!updatedOrder) {
    throw new ApiError(500, "Something went wrong while updating");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedOrder, "Order status changed by cook successfully!!!"));
});

export const changeStatusReception = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "reception") {
    throw new ApiError(500, "Unauthorized access");
  }

  const tableId = req.body.table;
  const  itemId  = req.body.item;
  const  statusValue  = req.body.status;

  const updatedOrder = await Order.findOneAndUpdate(
    {
      table: Number(tabaleId),
      "settlement.status": false,
      "items._id": itemId,
    },
    {
      $set: { "items.$.status": statusValue },
    },
    {
      new: true,
      projection: {
        "items.$": 1,
        "items.menu": 1,
        "items.waiter": 1,
        "items.cook": 1,
        "items.status": 1,
      },
    }
  );

  if (!updatedOrder) {
    throw new ApiError(500, "Something went wrong while updating");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, updatedOrder, "Order status changed by reception successfully!!!"));
});

export const clearOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "waiter") {
    throw new ApiError(500, "Unauthorized access");
  }

  const { orderId } = req.params;

  const waiterId = req.employee._id || req.admin._id;

  const clearedOrder = await Order.findByIdAndUpdate(orderId, {
    $set: {
      orderClear: {
        status: true,
        waiter: waiterId,
      },
    },
  });

  if (!clearedOrder) {
    throw new ApiError(500, "Something went wrong while clearing order");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, clearedOrder, "Order cleared successfully!!!"));
});

export const settleOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!req.admin && req.employee.role != "reception") {
    throw new ApiError(500, "Unauthorized access");
  }

  const { orderId } = req.params;

  const receptionId = req.employee._id || req.admin._id;

  const settledOrder = await Order.findByIdAndUpdate(
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

  if (!settledOrder) {
    throw new ApiError(500, "Something went wrong while settling order");
  }

  const historyData = settledOrder.toObject();

   delete historyData._id;

  const newHistory = await History.create(historyData);

  if(!newHistory){
    throw new ApiError(500, "Something went wrong while creating the histroy data")
  }

  const deleteData = await Order.findByIdAndDelete(orderId);

  return res
    .status(200)
    .json(new ApiResponse(201, newHistory, "Order settled successfully!!!"));
});
