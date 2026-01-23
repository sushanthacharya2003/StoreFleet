import jwt from "jsonwebtoken";
import User from "../src/user/models/user.schema.js";
import { ErrorHandler } from "../utils/errorHandler.js";

export const verifySession = async (req, res, next) => {
  try {
    const sessionToken = req.cookies?.token;

    if (!sessionToken) {
      return next(new ErrorHandler(401, "authentication required"));
    }

    const payload = jwt.verify(sessionToken, process.env.JWT_Secret);
    const currentUser = await User.findById(payload.id);

    if (!currentUser) {
      return next(new ErrorHandler(401, "invalid authentication token"));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new ErrorHandler(401, "authentication failed"));
  }
};
export const restrictToRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          403,
          `Access denied for role: ${req.user.role}`
        )
      );
    }
    next();
  };
};
