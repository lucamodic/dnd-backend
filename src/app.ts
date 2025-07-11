import express from "express"
import dotenv from "dotenv"
import { authRouter, adminRouter } from "./modules/index"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)
app.use("/admin", adminRouter)

export default app
