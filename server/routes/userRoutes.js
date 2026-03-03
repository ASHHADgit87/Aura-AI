import express from "express";
import { register, login } from "../controllers/authController.js";
import { getMe, deleteUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/me", protect, getMe);
userRouter.delete("/delete-account", protect, deleteUser);

export default userRouter;
