import express from "express";
import { auth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"; 
import { createMenuValidator, updateMenuValidator, getAllMenuValidator, paramsValidator } from "../middleware/validator.js";
import { createMenu, updateMenu, deleteMenu, getMenu, getAllMenu} from "../controllers/menu.controller.js"

const router = express.Router();

router.post("/createMenu", auth, upload.single("picture"), createMenuValidator, createMenu);
router.put("/updateMenu/:id", auth, upload.single("picture"), updateMenuValidator, updateMenu);
router.delete("/deleteMenu/:id", auth, paramsValidator, deleteMenu);
router.get("/getMenu/:id", auth, paramsValidator, getMenu);
router.get("/getAllMenu", auth, getAllMenuValidator, getAllMenu);

export default router;