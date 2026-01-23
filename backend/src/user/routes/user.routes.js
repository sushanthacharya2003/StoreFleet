import express from "express";
import {
  registerUser,
  loginUser,
  logoutCurrentUser,
  initiatePasswordReset,
  completePasswordReset,
  fetchOwnProfile,
  changePassword,
  updateOwnProfile,
  fetchAllUsers,
  fetchUserById,
  removeUser,
  modifyUserRole,
} from "../controller/user.controller.js";

import {
  verifySession,
  restrictToRoles,
} from "../../../middlewares/auth.js";

const router = express.Router();


router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/logout", verifySession, logoutCurrentUser);


router.post("/password/forgot", initiatePasswordReset);

router.put("/password/reset/:token", completePasswordReset);

router.put("/password/update", verifySession, changePassword);


router.get("/profile", verifySession, fetchOwnProfile);

router.put("/profile", verifySession, updateOwnProfile);


router.get(
  "/admin/users",
  verifySession,
  restrictToRoles("admin"),
  fetchAllUsers
);

router.get(
  "/admin/users/:id",
  verifySession,
  restrictToRoles("admin"),
  fetchUserById
);

router.delete(
  "/admin/users/:id",
  verifySession,
  restrictToRoles("admin"),
  removeUser
);

router.put(
  "/admin/users/:id",
  verifySession,
  restrictToRoles("admin"),
  modifyUserRole
);

export default router;
