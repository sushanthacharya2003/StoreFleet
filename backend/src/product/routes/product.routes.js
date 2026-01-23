import express from "express";

import {
  createProduct,
  fetchProducts,
  modifyProduct,
  removeProduct,
  fetchProductDetails,
  submitReview,
  fetchProductReviews,
  removeReview,
} from "../controllers/product.controller.js";

import {
  verifySession,
  restrictToRoles,
} from "../../../middlewares/auth.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", fetchProductDetails);
router.get("/:id/reviews", fetchProductReviews);

router.put("/:id/review", verifySession, submitReview);
router.delete("/review", verifySession, removeReview);

router.post("/", verifySession, restrictToRoles("admin"), createProduct);
router.put("/:id", verifySession, restrictToRoles("admin"), modifyProduct);
router.delete("/:id", verifySession, restrictToRoles("admin"), removeProduct);

export default router;
