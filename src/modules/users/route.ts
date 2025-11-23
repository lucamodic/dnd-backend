import { Router } from "express"
import { Controller } from "./controller"

export const userRouter = Router()

userRouter.get("/", Controller.list)
userRouter.get("/:id", Controller.get)
userRouter.post("/", Controller.post)
userRouter.patch("/", Controller.patch)
userRouter.delete("/", Controller.delete)
