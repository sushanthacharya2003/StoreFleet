import Order from "./order.schema.js";

export const saveOrder = async (payload) => {
  return new Order(payload).save();
};
