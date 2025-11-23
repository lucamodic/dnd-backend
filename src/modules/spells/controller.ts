import { Request, Response } from "express";
import { Service } from "./service";
import { sendResponse } from "../../utils/response";

const adminSecret = process.env.ADMIN_SECRET;

function checkAdmin(req: Request) {
  return req.headers["admin-secret"] === adminSecret;
}

export class Controller {
  static async list(req: Request, res: Response) {
    return sendResponse(res, await Service.list());
  }

  static async show(req: Request, res: Response) {
    return sendResponse(res, await Service.show(req.params.id));
  }

  static async importAll(req: Request, res: Response) {
    if (!checkAdmin(req)) {
      return res.status(401).json({ error: "Invalid admin secret" });
    }
    return sendResponse(res, await Service.importAll());
  }
}
