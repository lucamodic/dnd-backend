import { Router } from "express";
import { Controller } from "./controller";

export const monstersRouter = Router();

monstersRouter.post("/import", Controller.importAll);
