import Product from "./product.schema.js";

export const saveProduct = async (payload) => {
  return new Product(payload).save();
};

export const fetchAllProducts = async () => {
  return Product.find({});
};

export const updateProductById = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const removeProductById = async (id) => {
  return Product.findByIdAndDelete(id);
};

export const fetchProductById = async (id) => {
  return Product.findById(id);
};

export const countProducts = async () => {
  return Product.countDocuments();
};
