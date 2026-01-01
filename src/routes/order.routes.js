import express from "express";
import {
  createOrder,
  addOrder,
  allTableOrders,
  singleOrderView,
  kitchenOrdersView,
  changeStatusReception,
  changeStatusCook,
  changeStatusWaiter,
  settleOrder,
  clearOrder,
} from "../controllers/orders.controller.js";
import {
  paramsValidator,
  createOrderValidator,
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
router.put("/oderStatus/:id", auth, paramsValidator, changeStatusWaiter); //to change order status
router.put(
  "/oderStatusReview/:id",
  auth,
  paramsValidator,
  changeStatusReception
); //to review the order status by reception
router.put("/clearOrder/:id", auth, paramsValidator, clearOrder);
router.delete("/clearOrder/:id", auth, paramsValidator, settleOrder);

export default router;
