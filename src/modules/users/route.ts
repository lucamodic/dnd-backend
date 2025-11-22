import { Router } from "express"
import { Controller } from "./controller"

export const userRouter = Router()

userRouter.post("/", Controller.post)
userRouter.patch("/", Controller.patch)
userRouter.delete("/", Controller.delete)
