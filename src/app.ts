import express from "express"
import dotenv from "dotenv"
import { authRouter } from "./modules/index"

dotenv.config()

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use("/auth", authRouter)

export default app
