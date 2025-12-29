import express from "express";
import { createOrder } from "../controllers/orders.controller.js"

const router = express.Router()

//place order with table No.
router.post("/orders/:id", auth, createOrder);

// all order of a single tabale , so table id
router.get("/allOrderView/:id");

//single order with order Id
router.get("/singleOrderView/:id");

//table view for kitchen
router.get("/kitchenTableView");

//table id for order view in kitchen
router.get("/kitchensOrdersView/:id");

//change order with order id status by cooks - accept/reject/done
router.put("/kitchenOrderStatus/:id");

//to change order status from done to faulty and not faulty
router.put("/OderStatus/:id");

export default router;



