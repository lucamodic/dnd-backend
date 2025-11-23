import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { Service } from "./service";

const resolveCampaignId = (req: Request) => {
  const candidate =
    (req.query.campaignId as string) ||
    (req.query.campaign_id as string) ||
    (req.body?.campaignId as string);
  return candidate && candidate.trim().length ? candidate : undefined;
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
