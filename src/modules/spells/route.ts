import { Router } from "express";
import { Controller } from "./controller";

export const spellsRouter = Router();

spellsRouter.post("/import", Controller.importAll);
