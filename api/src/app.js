import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { notFound, errorHandler } from "./middlewares.js";
import path from "path";
import expressfileupload from "express-fileupload";

import userRouter from "./routes/users.js";
import employeeRouter from "./routes/employees.js";
import jobRouter from "./routes/jobs.js";
import departmentRouter from "./routes/departments.js";
import connectDatabase from "./configs/dbConfig.js";

config();

const app = express();
connectDatabase();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressfileupload());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/departments", departmentRouter);

app.use(
  "/api/v1/uploads",
  express.static(path.join(path.dirname(""), "./src/uploads/"))
);
app.get("/seed", async (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
