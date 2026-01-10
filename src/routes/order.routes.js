import express from "express";
import {
  createOrder,
  addOrder,
  allTableOrders,
  singleOrderView,
  kitchenOrdersView,
  changeStatusCook,
  deleteOrderWaiter,
  settleOrder,
  clearOrder,
  clearOrderView
} from "../controllers/orders.controller.js";
import {
  paramsValidator,
  createOrderValidator,
  deleteOrderValidation
} from "../middleware/validator.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

//place order with table No.
router.post("/createOrder", auth, createOrderValidator, createOrder); // for creating new order
router.put("/addOrders/:id", auth, paramsValidator, addOrder); // for adding order on existing table of orders
router.get("/allOrderView", auth, allTableOrders); // all order of a single tabale , so table id
router.get("/singleOrderView/:id", auth, paramsValidator, singleOrderView); //single order with order Id
router.get("/kitchensOrdersView", auth, kitchenOrdersView); //table id for order view in kitchen
router.put("/kitchenOrderStatus/:id", auth, paramsValidator, changeStatusCook); //change order status by cooks
router.delete("/deleteOrder/:id", auth, deleteOrderValidation, deleteOrderWaiter); // delete the order from the list
router.put("/clearOrder/:id", auth, paramsValidator, clearOrder);
router.get("/clearedOrderView", auth, clearOrderView);
router.delete("/settleOrder/:id", auth, paramsValidator, settleOrder);

export default router;
