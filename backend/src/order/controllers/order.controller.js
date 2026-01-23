
import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  const order = await createNewOrderRepo({
    ...req.body,
    user: req.user._id,
    paidAt: Date.now(),
  });
  res.status(201).json({ success: true, order });
};
