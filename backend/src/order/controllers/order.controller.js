// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

// Write your code here for placing a new order
export const createNewOrder = async (req, res, next) => {
  const order = await createNewOrderRepo({
    ...req.body,
    user: req.user._id,
    paidAt: Date.now(),
  });
  res.status(201).json({ success: true, order });
};
