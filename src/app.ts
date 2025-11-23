import express from "express";
import dotenv from "dotenv";
import { authRouter, userRouter, monstersRouter, classesRouter, spellsRouter } from "./modules/index";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/monsters", monstersRouter);
app.use("/classes", classesRouter);
app.use("/spells", spellsRouter);

export default app;
