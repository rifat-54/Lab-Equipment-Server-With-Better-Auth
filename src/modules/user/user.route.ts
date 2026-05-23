import { Router } from "express";
import { userController } from "./user.controller";

const userRouter=Router()

userRouter.post("/register",userController.register)
userRouter.post("/login",userController.loginUser)

export default userRouter;