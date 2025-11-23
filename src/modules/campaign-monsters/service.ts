import { Repository, CampaignMonsterInsert } from "./repository";

type Payload = Partial<CampaignMonsterInsert> & {
  campaignId?: string;
  monsterId?: string;
};

const ensureId = (value?: string, label = "id") =>
  value && value.trim()
    ? null
    : { status: 400, error: `${label} is required` };

const getCampaignId = (payload: Payload) =>
  payload.campaignId ?? payload.campaign_id;

const getMonsterId = (payload: Payload) =>
  payload.monsterId ?? payload.monster_id;

export class Service {
  static async list(campaignId?: string) {
    return campaignId
      ? Repository.listByCampaign(campaignId)
      : Repository.list();
  }

  static async show(id: string) {
    const invalid = ensureId(id, "Campaign monster id");
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const campaignId = getCampaignId(payload);
    const monsterId = getMonsterId(payload);

    const campaignError = ensureId(campaignId, "campaignId");
    if (campaignError) return campaignError;

    const monsterError = ensureId(monsterId, "monsterId");
    if (monsterError) return monsterError;

    const insertion = await Repository.create({
      campaign_id: campaignId!,
      monster_id: monsterId!,
    });

    if ("error" in insertion) return insertion;

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;

    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = ensureId(id, "Campaign monster id");
    if (invalid) return invalid;

    const updates: Partial<CampaignMonsterInsert> = {};
    if (getCampaignId(payload)) {
      updates.campaign_id = getCampaignId(payload)!;
    }
    if (getMonsterId(payload)) {
      updates.monster_id = getMonsterId(payload)!;
    }

    if (!Object.keys(updates).length) {
      return {
        status: 400,
        error: "Provide campaignId or monsterId to update",
      };
    }

    const updateResult = await Repository.update(id, updates);
    if ("error" in updateResult) return updateResult;

    const detail = await Repository.getById(id);
    if ("error" in detail) return detail;

    return { status: 200, data: detail.data };
  }

  static async destroy(id: string) {
    const invalid = ensureId(id, "Campaign monster id");
    if (invalid) return invalid;
    return Repository.delete(id);
  }
}
