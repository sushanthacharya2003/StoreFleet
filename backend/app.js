import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import productRouter from "./src/product/routes/product.routes.js";
import userRouter from "./src/user/routes/user.routes.js";
import orderRouter from "./src/order/routes/order.routes.js";

import { globalErrorHandler } from "./middlewares/errorHandlerMiddleware.js";

const envFilePath = path.resolve("backend", "config", "uat.env");
dotenv.config({ path: envFilePath });

const application = express();

application.use(express.json());
application.use(cookieParser());

application.use("/api/storefleet/products", productRouter);
application.use("/api/storefleet/users", userRouter);
application.use("/api/storefleet/orders", orderRouter);

application.use(globalErrorHandler);

export default application;
