import { Router } from "express";
import { Controller } from "./controller";

export const campaignMonstersRouter = Router();

campaignMonstersRouter.get("/", Controller.list);
campaignMonstersRouter.get("/:id", Controller.show);
campaignMonstersRouter.post("/", Controller.create);
campaignMonstersRouter.patch("/:id", Controller.update);
campaignMonstersRouter.delete("/:id", Controller.destroy);
