import express from "express";
import {
  registerValidtaion,
  registerAdminValidation,
  loginAdminValidation,
  updateEmployeeValidation,
  paramsValidator,
  getAllEmployeeValidation
} from "../middleware/validator.js";
import { upload } from "../middleware/upload.js";
import { getEmployeeProfile } from "../controllers/employee.controller.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  registerEmployee,
  deleteEmployee,
  updateEmployee,
  getAllProfile,
} from "../controllers/admin.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/adminRegister", registerAdminValidation, registerAdmin);
router.post("/adminLogin", loginAdminValidation, loginAdmin);
router.get("/adminLogout", auth, logoutAdmin);

router.post("/registerEmployee", auth, upload.single("profileImage"), registerValidtaion, registerEmployee);
router.put("/updateEmployee/:id", auth, upload.single("profileImage"), updateEmployeeValidation, updateEmployee);
router.delete("/deleteEmployee/:id", auth, paramsValidator, deleteEmployee);
router.get("/getEmployee/:id", auth, paramsValidator, getEmployeeProfile);
router.get("/getAllEmployee", auth, getAllEmployeeValidation, getAllProfile);

export default router;
