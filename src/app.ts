import express from "express";
import dotenv from "dotenv";
import {
  authRouter,
  userRouter,
  playersRouter,
  campaignsRouter,
  charactersRouter,
  campaignMonstersRouter,
  monstersRouter,
  classesRouter,
  spellsRouter,
  initiativeTracksRouter,
  encountersRouter,
  encounterParticipantsRouter,
} from "./modules/index";
import cors from "cors";
import { requireAuth } from "./modules/auth/middleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use(requireAuth);
app.use("/user", userRouter);
app.use("/players", playersRouter);
app.use("/campaigns", campaignsRouter);
app.use("/characters", charactersRouter);
app.use("/campaign-monsters", campaignMonstersRouter);
app.use("/monsters", monstersRouter);
app.use("/classes", classesRouter);
app.use("/spells", spellsRouter);
app.use("/initiative-tracks", initiativeTracksRouter);
app.use("/encounters", encountersRouter);
app.use("/encounter-participants", encounterParticipantsRouter);

export default app;
