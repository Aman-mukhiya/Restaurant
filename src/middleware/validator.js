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

//for Menu routes
export const createMenuValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("description")
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Description cannot be more than 1000 characters long"),

  body("picture").optional(),
];

export const updateMenuValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name is be empty")
    .isLength({ max: 120 })
    .withMessage("Name too long"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Description cannot be more than 1000 characters long"),

  body("picture").optional(),
];

export const getAllMenuValidator = [
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

// for orders route
export const createOrderValidator = [
  // table
  body("table")
    .notEmpty()
    .withMessage("Table is required")
    .isInt({ min: 1 })
    .withMessage("Table must be a number"),

  // items array must exist and not be empty
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

export const some = [
  // menu validation
  body("items.*.menu")
    .notEmpty()
    .withMessage("Menu is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid menu id"),

  // quantity validation
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("items.*.status")
    .notEmpty()
    .withMessage("status cannot be empty")
    .isIn(["pending", "cooking", "reject", "fault", "cancelled", "cooked"])
    .withMessage("Invalid status"),

  // optional fields (only validate if present)
  body("items.*.cook")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid cook id"),

  body("reception")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid reception id"),
];

export const updateOrder = [
  // quantity validation
  body("table").notEmpty().withMessage("Table is required").isInt(),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("items.*.status")
    .notEmpty()
    .withMessage("status cannot be empty")
    .isIn(["pending", "cooking", "reject", "fault", "cancelled", "cooked"])
    .withMessage("Invalid status"),
];

export const deleteOrderValidation = [
  param('id')
    .exists().withMessage('Table ID is required')
    .isMongoId().withMessage('Invalid Table ID format'),

  body('table').isInt().withMessage("Invalid table")
]

export const changeStatusWaiter = [
  param('id')
    .exists().withMessage('Table ID is required')
    .isMongoId().withMessage('Invalid ID format'),

  body('table').isInt().withMessage("Invalid table")
]

export const retrivedValidation = [
  query("page").isInt().withMessage("page must be a number"),
  query("limit").isInt().withMessage("limit must be a number"),
  query("sortType")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortType must be 'asc' or 'desc'."),
]

export const historyDateValidator = [
  query("startDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("startDate must be in YYYY-MM-DD format")
    .toDate(),

  query("endDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("endDate must be in YYYY-MM-DD format")
    .toDate(),

  query().custom((_, { req }) => {
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error("endDate cannot be before startDate");
      }
    }
    return true;
  }),
];
