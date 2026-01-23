import mongoose from "mongoose";

export const initializeDatabase = async () => {
  try {
    console.log("Attempting database connection...");

    const connection = await mongoose.connect(process.env.mongoURI);

    console.log(
      `Database connected successfully at ${connection.connection.host}`
    );
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};
