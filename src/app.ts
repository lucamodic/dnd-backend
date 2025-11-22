import express from "express";
import dotenv from "dotenv";
import { authRouter, userRouter, monstersRouter } from "./modules/index";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/monsters", monstersRouter);

export default app;
