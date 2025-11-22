import { Request, Response } from "express";
import { Service } from "./service";
import { sendResponse } from "../../utils/response";

const adminSecret = process.env.ADMIN_SECRET;

function checkForAdminSecret(req: Request): boolean {
  const secret = req.headers["admin-secret"];
  return secret === adminSecret;
}

export class Controller {
  static async importAll(req: Request, res: Response) {
    if (!checkForAdminSecret(req)) {
      return res.status(401).json({ error: "Invalid admin secret" });
    }
    return sendResponse(res, await Service.importAll());
  }
}
