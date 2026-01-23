import crypto from "crypto";

import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { issueAuthToken } from "../../../utils/sendToken.js";

import {
  saveUser,
  removeUserById,
  getUserForPasswordReset,
  getUserByQuery,
  fetchAllUsers,
  updateUserProfileById,
  updateUserByAdmin,
} from "../models/user.repository.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await saveUser(req.body);
    issueAuthToken(user, res, 200);
    sendWelcomeEmail(user).catch(() => {});
  } catch (err) {
    if (err.code === 11000) {
      return next(new ErrorHandler(400, "email already in use"));
    }
    next(new ErrorHandler(400, err.message));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler(400, "email and password are required"));
    }

    const user = await getUserByQuery({ email }, true);
    if (!user) {
      return next(new ErrorHandler(401, "invalid login credentials"));
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return next(new ErrorHandler(401, "invalid login credentials"));
    }

    issueAuthToken(user, res, 200);
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const logoutCurrentUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({ success: true, message: "logged out successfully" });
};

export const initiatePasswordReset = async (req, res, next) => {
  try {
    const user = await getUserByQuery({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler(404, "account not found"));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/storefleet/user/password/reset/${resetToken}`;

    await sendPasswordResetEmail(user, resetLink);

    res.status(200).json({
      success: true,
      message: "password reset email sent",
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const completePasswordReset = async (req, res, next) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await getUserForPasswordReset(hashed);
    if (!user) {
      return next(new ErrorHandler(400, "token invalid or expired"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    issueAuthToken(user, res, 200);
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const fetchOwnProfile = async (req, res, next) => {
  try {
    const user = await getUserByQuery({ _id: req.user._id });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await getUserByQuery({ _id: req.user._id }, true);

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return next(new ErrorHandler(401, "current password incorrect"));
    }

    if (!newPassword || newPassword !== confirmPassword) {
      return next(new ErrorHandler(400, "password confirmation failed"));
    }

    user.password = newPassword;
    await user.save();

    issueAuthToken(user, res, 200);
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const updateOwnProfile = async (req, res, next) => {
  try {
    const updated = await updateUserProfileById(req.user._id, req.body);
    res.status(200).json({ success: true, updated });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const fetchAllUsersForAdmin = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const user = await getUserByQuery({ _id: req.params.id });
    if (!user) {
      return next(new ErrorHandler(404, "user not found"));
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const removeUser = async (req, res, next) => {
  try {
    const removed = await removeUserById(req.params.id);
    if (!removed) {
      return next(new ErrorHandler(404, "user not found"));
    }
    res.status(200).json({ success: true, removed });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const modifyUserRole = async (req, res, next) => {
  try {
    const updated = await updateUserByAdmin(req.params.id, req.body);
    if (!updated) {
      return next(new ErrorHandler(404, "user not found"));
    }
    res.status(200).json({ success: true, updated });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};
