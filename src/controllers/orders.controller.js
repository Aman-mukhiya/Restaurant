import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { Admin } from "../models/admin.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createOrder = asyncHandler( (req, res) => {
   const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
     }

     const newOrder = {
        table: 1,
        items: [],
        
     }


});