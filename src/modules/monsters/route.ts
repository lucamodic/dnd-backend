import { Router } from "express";
import { Controller } from "./controller";

export const monstersRouter = Router();

monstersRouter.get("/", Controller.list);
monstersRouter.get("/:id", Controller.show);
monstersRouter.post("/", Controller.create);
monstersRouter.patch("/:id", Controller.update);
monstersRouter.delete("/:id", Controller.destroy);
monstersRouter.post("/import", Controller.importAll);
