import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [2, "name must be at least 2 characters"],
      maxlength: [30, "name must be under 30 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email address"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    avatar: {
      publicId: {
        type: String,
        default: "default_avatar",
      },
      url: {
        type: String,
        default: "default_avatar_url",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_Secret,
    { expiresIn: process.env.JWT_Expire }
  );
};


userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.getResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return rawToken;
};

const User = mongoose.model("User", userSchema);
export default User;
