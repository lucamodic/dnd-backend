import { Router } from "express"
import { Controller } from "./controller"

export const authRouter = Router()

authRouter.post("/", Controller.post)
authRouter.post("/signup", Controller.signup)
authRouter.post("/verify-email", Controller.verifyEmail)
