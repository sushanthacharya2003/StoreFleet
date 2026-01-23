import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [10, "description must be at least 10 characters"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      max: [99999999, "price exceeds allowed limit"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "category is required"],
      enum: [
        "Mobile",
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Automotive",
        "Health & Beauty",
        "Sports & Outdoors",
        "Toys & Games",
        "Books & Media",
        "Jewelry",
        "Food & Grocery",
        "Furniture",
        "Shoes",
        "Pet Supplies",
        "Office Supplies",
        "Baby & Kids",
        "Art & Collectibles",
        "Travel & Luggage",
        "Music Instruments",
        "Electrical Appliances",
        "Handmade Crafts",
      ],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      max: [99999, "stock exceeds allowed limit"],
      default: 1,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
