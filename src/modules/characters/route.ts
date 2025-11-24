import { Router } from "express";
import { Controller } from "./controller";

export const charactersRouter = Router();

charactersRouter.get("/", Controller.list);
charactersRouter.get("/campaigns/:campaignId", Controller.list);
charactersRouter.get("/:id", Controller.show);
charactersRouter.post("/", Controller.create);
charactersRouter.patch("/:id", Controller.update);
charactersRouter.delete("/:id", Controller.destroy);
