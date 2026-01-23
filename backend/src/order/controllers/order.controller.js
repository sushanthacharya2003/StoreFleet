import { ErrorHandler } from "../../../utils/errorHandler.js";
import { saveOrder } from "../model/order.repository.js";

export const placeOrder = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      user: req.user._id,
      paidAt: Date.now(),
    };

    const order = await saveOrder(payload);

    if (!order) {
      return next(new ErrorHandler(400, "order creation failed"));
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};
