import { Router } from "express";
import { Controller } from "./controller";

export const spellsRouter = Router();

spellsRouter.get("/", Controller.list);
spellsRouter.get("/:id", Controller.show);
spellsRouter.post("/import", Controller.importAll);
