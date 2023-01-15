import User from "../models/userModels.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
//Update User Data
const updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirmed) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  //2) Check if user exists
  const filteredBody = filterObj(req.body, "name", "email");

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    message: "Benutzer erfolgreich aktualisiert",
    data: {
      user: updateUser,
    },
  });
});
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.id, { active: false });

  res.status(204).json({
    status: "Success",
    // message: "Benutzer wurde erfolgreich gelöscht",
    data: null,
  });
});

///--USERS
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: "Success",
    results: users.length,
    data: {
      users,
    },
  });
});
const createUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
const getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

export default {
  getAllUsers,
  createUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
