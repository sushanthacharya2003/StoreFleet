import { ErrorHandler } from "../../../utils/errorHandler.js";
import Product from "../model/product.schema.js";
import {
  saveProduct,
  updateProductById,
  removeProductById,
  fetchProductById,
  countProducts,
} from "../model/product.repository.js";

export const createProduct = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user._id,
    };

    const created = await saveProduct(payload);

    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const fetchProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const filter = {
      name: { $regex: keyword, $options: "i" },
    };

    const products = await Product.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await countProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      products,
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const modifyProduct = async (req, res, next) => {
  try {
    const updated = await updateProductById(req.params.id, req.body);

    if (!updated) {
      return next(new ErrorHandler(404, "product not found"));
    }

    res.status(200).json({
      success: true,
      updated,
    });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const removed = await removeProductById(req.params.id);

    if (!removed) {
      return next(new ErrorHandler(404, "product not found"));
    }

    res.status(200).json({
      success: true,
      removed,
    });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const fetchProductDetails = async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);

    if (!product) {
      return next(new ErrorHandler(404, "product not found"));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return next(new ErrorHandler(400, "rating is required"));
    }

    const product = await fetchProductById(req.params.id);
    if (!product) {
      return next(new ErrorHandler(404, "product not found"));
    }

    const userId = req.user._id.toString();

    const index = product.reviews.findIndex(
      (r) => r.user.toString() === userId
    );

    const review = {
      user: userId,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    if (index >= 0) {
      product.reviews[index] = review;
    } else {
      product.reviews.push(review);
    }

    const totalRating = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    product.rating = totalRating / product.reviews.length;
    product.numOfReviews = product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};

export const fetchProductReviews = async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);

    if (!product) {
      return next(new ErrorHandler(404, "product not found"));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (err) {
    next(new ErrorHandler(400, err.message));
  }
};

export const removeReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.query;

    const product = await fetchProductById(productId);
    if (!product) {
      return next(new ErrorHandler(404, "product not found"));
    }

    const index = product.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (index === -1) {
      return next(new ErrorHandler(404, "review not found"));
    }

    if (product.reviews[index].user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler(403, "action not permitted"));
    }

    product.reviews.splice(index, 1);

    product.numOfReviews = product.reviews.length;

    const totalRating = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    product.rating =
      product.reviews.length === 0
        ? 0
        : totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message));
  }
};
