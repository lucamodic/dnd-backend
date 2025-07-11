import express from "express"
import dotenv from "dotenv"
import { authRouter } from "./modules/index"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)

export default app
