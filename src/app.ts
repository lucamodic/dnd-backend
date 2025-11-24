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
import cors, { CorsOptions } from "cors";
import { requireAuth } from "./modules/auth/middleware";

dotenv.config();

const app = express();
app.use(express.json());

const configuredOrigins =
  process.env.CORS_ORIGINS || process.env.FRONT_URL || "";

const defaultOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "https://dnd-chi-one.vercel.app",
  "https://dnd-backend-pi.vercel.app",
];

const allowedOrigins = Array.from(
  new Set(
    [...configuredOrigins.split(","), ...defaultOrigins]
      .map((origin) => origin.trim())
      .filter(Boolean)
  )
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    console.error("Rejected CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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
