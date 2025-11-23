import { Request, Response } from "express"
import { Service } from "./service"
import { sendResponse } from "../../utils/response"

export class Controller {
  static async post(req: Request, res: Response) {
    return sendResponse(res, await Service.post(req.body))
  }

  static async signup(req: Request, res: Response) {
    return sendResponse(res, await Service.signup(req.body))
  }

  static async verifyEmail(req: Request, res: Response) {
    return sendResponse(res, await Service.verifyEmail(req.body.token))
  }
}
