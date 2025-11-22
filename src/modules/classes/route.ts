import { Router } from "express";
import { Controller } from "./controller";

export const classesRouter = Router();

classesRouter.post("/import", Controller.importAll);
