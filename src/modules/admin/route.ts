import { Router } from "express"
import { Controller } from "./controller"

export const adminRouter = Router()

adminRouter.post("/", Controller.post)
adminRouter.patch("/", Controller.patch)
adminRouter.delete("/", Controller.delete)
