import express from "express";
import { registerUser, getUsers, deleteUser, loginUser } from "../controllers/usercontroller.js";
import authAdmin from "../middleware/Authadmin.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/list", authAdmin, getUsers);
userRouter.delete("/remove/:id",authAdmin, deleteUser);

export default userRouter;