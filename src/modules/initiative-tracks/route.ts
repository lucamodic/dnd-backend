import { Router } from "express";
import { Controller } from "./controller";

export const initiativeTracksRouter = Router();

initiativeTracksRouter.get("/", Controller.list);
initiativeTracksRouter.get("/:id", Controller.show);
initiativeTracksRouter.post("/", Controller.create);
initiativeTracksRouter.patch("/:id", Controller.update);
initiativeTracksRouter.delete("/:id", Controller.destroy);
