import { ErrorHandler } from "../utils/errorHandler.js";

export const globalErrorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(status).json({
    success: false,
    message,
  });
};

export const registerProcessErrorHandlers = () => {
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.message);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
  });
};
