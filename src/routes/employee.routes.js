import express from "express";
import { loginValidtaion } from "../middleware/validator.js"
import { loginEmployee, logoutEmployee, getEmployeeProfile } from "../controllers/employee.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();


router.post("/employeeLogin", loginValidtaion,  loginEmployee);
router.get("/employeeLogout", auth, logoutEmployee);
router.get("/employeeProfile", auth, getEmployeeProfile);

export default router;