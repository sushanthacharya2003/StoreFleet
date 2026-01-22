// Please don't change the pre-written code
// Import the necessary modules here

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
} from "../model/product.repository.js";
import ProductModel from "../model/product.schema.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "some error occured!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// Implement the functionality for search, filter and pagination this function.
export const getAllProducts = async (req, res, next) => {
  const { keyword = "", page = 1, limit = 5 } = req.query;

  const query = {
    name: { $regex: keyword, $options: "i" },
  };

  const products = await ProductModel.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await getTotalCountsOfProduct();

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    products,
  });
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };
    if (!rating) {
      return next(new ErrorHandler(400, "rating can't be empty"));
    }
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const findRevieweIndex = product.reviews.findIndex((rev) => {
      return rev.user.toString() === user.toString();
    });
    if (findRevieweIndex >= 0) {
      product.reviews.splice(findRevieweIndex, 1, review);
    } else {
      product.reviews.push(review);
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    const updatedRatingOfProduct = avgRating / product.reviews.length;
    product.rating = updatedRatingOfProduct;
    await product.save({ validateBeforeSave: false });
    res
      .status(201)
      .json({ success: true, msg: "thx for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.query;

    // ... basic checks stay the same ...

    const product = await findProductRepo(productId);
    if (!product) return next(new ErrorHandler(400, "Product not found!"));

    const reviews = product.reviews;

    const isReviewExistIndex = reviews.findIndex((rev) =>
      rev._id.toString() === reviewId.toString()
    );

    if (isReviewExistIndex < 0) {
      return next(new ErrorHandler(400, "review doesn't exist"));
    }

    const reviewToBeDeleted = reviews[isReviewExistIndex];

    // 1. ALWAYS check permission BEFORE modifying the array
    if (reviewToBeDeleted.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler(403, "not allowed"));
    }

    // 2. NOW it is safe to delete
    reviews.splice(isReviewExistIndex, 1);

    // 3. Update the total number of reviews count
    product.numOfReviews = reviews.length;

    // 4. Recalculate Rating
    let avg = 0;
    reviews.forEach(r => avg += r.rating);
    product.rating = reviews.length ? avg / reviews.length : 0;

    // 5. Save the changes
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      msg: "review deleted successfully",
      deletedReview: reviewToBeDeleted,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};