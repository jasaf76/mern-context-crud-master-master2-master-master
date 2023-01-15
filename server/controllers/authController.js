import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";
//CREATE TOKEN

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true,
    httpOnly: true,
  };

  if((process.env.NODE_ENV = "production")) cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};

//SIGNUP
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirmed: req.body.passwordConfirmed,
  // });
  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "Success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});
//LOGIN USER

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 500));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
  // const token = signToken(user.id);
  // res.status(200).json({
  //   status: "Success",
  //   token,
  // });
});

//PROTECT ROUTES
const protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(",")[1];
  }
  //console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3)Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }
  //4)Check if user changed password after the token was issued
  //currentUser.changedPasswordAfter(decoded.iat);
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Sie haben vor Kurz ihre Passwort geändert, bitte logen Sie sich mit ihren neun Passwort ein",
        401
      )
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Sie haben keine Berechtigung um diese Aktion durchzuführen",
          403
        )
      );
    }
    next();
  };
};
//FORGOT PASSWORD

const forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Dieser Email passt nicht zu dem User", 404));
  }
  //2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3)Send email with reset token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Haben Sie Ihr Passwort vergessen? Senden Sie eine PATCH-Anfrage mit Ihrem neuen Passwort und einer Passwortbestätigung an: ${resetURL}.\nWenn Sie Ihr Passwort nicht vergessen haben, ignorieren Sie bitte diese E-Mail!`;

  try {
    await sendEmail({
      // from: process.env.EMAIL_FROM,
      email: user.email,
      subject: "Ihre Passwort zurücksetzen (gültig für 10 min)",
      message,
    });
    res.status(200).json({
      status: "Success",
      message: "Token an Ihre Email gesendet",
      // resetToken,
      // resetURL,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "Es gab ein Problem beim Senden der Email, bitte versuchen Sie es später nochmal",
        500
      )
    );
  }
});

//RESET PASSWORD

const resetPassword = async (req, res, next) => {
  //1)get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //  2)if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError("Token ist ungültig oder abgelaufen", 400));
  }
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //3)update changedPasswordAt property for the user

  await user.save();
  //4)Log the user in, send JWT
  createSendToken(user, 200, res);
  // const token = signToken(user.id);
  // res.status(200).json({
  //   status: "Success",
  //   token,
  //   message: "Passwort erfolgreich geändert",
  // });
};
//UPDATE PASSWORD

const updatePassword = catchAsync(async (req, res, next) => {
  //1)get user based on the token
  const user = await User.findById(req.user.id).select("+password");
  //  2)check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Die Passwörter stimmen nicht überein", 400));
  }
  //3)if so, update password
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  await user.save();
  //4)Log the user in, send JWT
  createSendToken(user, 200, res);
});

export default {
  signup,
  login,

  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
