import express from "express";
import { registerValidtaion, loginValidtaion } from "../middleware/validator.js"
import  { upload }  from "../middleware/upload.js";
import { registerUser, loginUser, getProfile } from "../controllers/employee.controller.js";

const router = express.Router();

router.post("/auth/register",upload.single("profileImage"),registerValidtaion, registerUser);
router.post("/auth/login",loginValidtaion,  loginUser);
router.get("auth/profile",getProfile);

export default router;