import { Router } from "express";
import { Controller } from "./controller";

export const encounterParticipantsRouter = Router();

encounterParticipantsRouter.get("/", Controller.list);
encounterParticipantsRouter.get("/:id", Controller.show);
encounterParticipantsRouter.post("/", Controller.create);
encounterParticipantsRouter.patch("/:id", Controller.update);
encounterParticipantsRouter.delete("/:id", Controller.destroy);
