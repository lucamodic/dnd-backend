import { Router } from "express";
import { Controller } from "./controller";

export const classesRouter = Router();

classesRouter.get("/", Controller.list);
classesRouter.get("/:id", Controller.show);
classesRouter.post("/import", Controller.importAll);
