import express from "express";
import { placeOrder } from "../controllers/order.controller.js";
import { verifySession } from "../../../middlewares/auth.js";

const router = express.Router();

router.post("/new", verifySession, placeOrder);

export default router;
