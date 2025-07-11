import { Request, Response } from "express"
import { Service } from "./service"
import { sendResponse } from "../../utils/response"

export class Controller {
  static async post(req: Request, res: Response) {
    return sendResponse(res, await Service.post(req.body))
  }
}
