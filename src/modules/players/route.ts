import { Router } from "express";
import { Controller } from "./controller";

export const playersRouter = Router();

playersRouter.get("/", Controller.list);
playersRouter.get("/:id", Controller.show);
playersRouter.post("/", Controller.create);
playersRouter.patch("/:id", Controller.update);
playersRouter.delete("/:id", Controller.destroy);
