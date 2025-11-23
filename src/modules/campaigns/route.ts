import { Router } from "express";
import { Controller } from "./controller";

export const campaignsRouter = Router();

campaignsRouter.get("/", Controller.list);
campaignsRouter.get("/:id", Controller.show);
campaignsRouter.post("/", Controller.create);
campaignsRouter.patch("/:id", Controller.update);
campaignsRouter.delete("/:id", Controller.destroy);
