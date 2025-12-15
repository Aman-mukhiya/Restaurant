import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({limit: "16kb"}));// encodeds url space -> %20
app.use(express.static("public"))// if i took any files this is where i store


//routes

export default app;