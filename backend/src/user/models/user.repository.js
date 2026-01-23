import User from "./user.schema.js";

export const saveUser = async (payload) => {
  const user = new User(payload);
  return user.save();
};

export const getUserByQuery = async (query, includePassword = false) => {
  const builder = User.findOne(query);
  if (includePassword) {
    builder.select("+password");
  }
  return builder;
};

export const getUserForPasswordReset = async (hashedToken) => {
  return User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

export const updateUserProfileById = async (userId, updateData) => {
  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const fetchAllUsers = async () => {
  return User.find({});
};
export const removeUserById = async (userId) => {
  return User.findByIdAndDelete(userId);
};

export const updateUserByAdmin = async (userId, updateData) => {
  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};
