import { body, param, query } from "express-validator";

export const registerValidtaion = [
  body("name")
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters")
    .matches("[A-Z]")
    .withMessage("password must contain capital letters")
    .matches("[a-z]")
    .withMessage("Password must contain small letters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number"),

  body("profile").optional(),

  body("phone").isMobilePhone().withMessage("Invalid phone number"),

  body("role")
    .notEmpty()
    .withMessage("role cannot be empty")
    .isIn(["waiter", "cook", "reception"])
    .withMessage("Invalid role!"),
];

export const loginValidtaion = [
  body("name")
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters")
    .matches("[A-Z]")
    .withMessage("password must contain capital letters")
    .matches("[a-z]")
    .withMessage("Password must contain small letters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number"),
];

export const updateEmployeeValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("password")
    .optional()
    .notEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters")
    .matches("[A-Z]")
    .withMessage("password must contain capital letters")
    .matches("[a-z]")
    .withMessage("Password must contain small letters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number"),

  body("profile").optional(),

  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),

  body("role")
    .optional()
    .notEmpty()
    .withMessage("role cannot be empty")
    .isIn(["waiter", "cook", "reception"])
    .withMessage("Invalid role!"),

  param("id").isMongoId().withMessage("Invalid ID"),
];

export const paramsValidator = [
  param("id").isMongoId().withMessage("Invalid ID"),
];

export const getAllEmployeeValidation = [
  query("search")
    .optional()
    .trim()
    .matches(/^[\w\s.,-]*$/) // letters, numbers, underscore, space, comma, dot, dash
    .withMessage("Search query contains invalid characters")
    .isLength({ max: 100 }),
  query("page").isInt().withMessage("page must be a number"),
  query("limit").isInt().withMessage("limit must be a number"),
  query("sortType")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortType must be 'asc' or 'desc'."),
];

export const registerAdminValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters")
    .matches("[A-Z]")
    .withMessage("password must contain capital letters")
    .matches("[a-z]")
    .withMessage("Password must contain small letters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number"),

  body("phone").isMobilePhone().withMessage("Invalid phone number"),
];

export const loginAdminValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is empty")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters")
    .matches("[A-Z]")
    .withMessage("password must contain capital letters")
    .matches("[a-z]")
    .withMessage("Password must contain small letters")
    .matches("[0-9]")
    .withMessage("Password must contain a Number"),

  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
];
