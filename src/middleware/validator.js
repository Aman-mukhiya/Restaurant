import { body } from "express-validator";

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
