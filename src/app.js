import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import employeeRouter from "./routes/employee.routes.js"
import adminRouter from "./routes/admin.routes.js"

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: "16kb"}));
// app.use(express.urlencoded({limit: "16kb"}));// encodeds url space -> %20
app.use(express.urlencoded());// encodeds url space -> %20
app.use(express.static("public"))// if i took any files this is where i store

//routes
app.use("/api/v1/restaurant",employeeRouter);

//admin routes
app.use("/api/v1/restaurant", adminRouter);

export default app;