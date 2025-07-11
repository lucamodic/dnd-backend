import { Router } from "express"
import { Controller } from "./controller"

export const authRouter = Router()

authRouter.post("/", Controller.post)
