import express from "express";
import userControllers from "../controllers/userControllers.js";
import authController from "../controllers/authController.js";
const router = express.Router();
//ROUTER AUTH
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, userControllers.updateMe);
router.delete("/deleteMe", authController.protect, userControllers.deleteMe);

//ROUTER USERS
router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUsers);
router
  .route("/:id")
  .get(userControllers.getSingleUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
