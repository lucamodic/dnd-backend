import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { Service } from "./service";

const resolveUserId = (req: Request) =>
  req.authorization?.claims?.id as string | undefined;

export class Controller {
  static async list(req: Request, res: Response) {
    return sendResponse(res, await Service.list(resolveUserId(req)));
  }

  static async show(req: Request, res: Response) {
    return sendResponse(res, await Service.show(req.params.id));
  }

  static async create(req: Request, res: Response) {
    return sendResponse(
      res,
      await Service.create(req.body, resolveUserId(req))
    );
  }

  static async update(req: Request, res: Response) {
    return sendResponse(res, await Service.update(req.params.id, req.body));
  }

  static async destroy(req: Request, res: Response) {
    return sendResponse(res, await Service.destroy(req.params.id));
  }
}
