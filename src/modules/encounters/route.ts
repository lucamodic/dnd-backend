import { Router } from "express";
import { Controller } from "./controller";

export const encountersRouter = Router();

encountersRouter.get("/", Controller.list);
encountersRouter.get("/:id", Controller.show);
encountersRouter.post("/", Controller.create);
encountersRouter.patch("/:id", Controller.update);
encountersRouter.delete("/:id", Controller.destroy);
