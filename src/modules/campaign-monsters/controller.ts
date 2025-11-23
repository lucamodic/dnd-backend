import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { Service } from "./service";

const resolveCampaignId = (req: Request) => {
  const value = (req.query.campaignId ??
    req.query.campaign_id ??
    req.params.campaignId) as string | undefined;
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
};

export class Controller {
  static async list(req: Request, res: Response) {
    return sendResponse(res, await Service.list(resolveCampaignId(req)));
  }

  static async show(req: Request, res: Response) {
    return sendResponse(res, await Service.show(req.params.id));
  }

  static async create(req: Request, res: Response) {
    return sendResponse(res, await Service.create(req.body));
  }

  static async update(req: Request, res: Response) {
    return sendResponse(res, await Service.update(req.params.id, req.body));
  }

  static async destroy(req: Request, res: Response) {
    return sendResponse(res, await Service.destroy(req.params.id));
  }
}
