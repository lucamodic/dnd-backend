import { Repository, InitiativeTrackInsert } from "./repository";

type Payload = Partial<InitiativeTrackInsert> & {
  campaignId?: string;
  campaign_id?: string;
};

const requireId = (id?: string) =>
  id && id.trim()
    ? null
    : { status: 400, error: "Initiative track id is required" };

const requireTitle = (title?: string | null) =>
  title && title.trim()
    ? null
    : { status: 400, error: "Track title is required" };

const requireCampaignId = (campaignId?: string) =>
  campaignId && campaignId.trim()
    ? null
    : { status: 400, error: "campaignId is required" };

const mapPayload = (payload: Payload): InitiativeTrackInsert => ({
  title: payload.title!.trim(),
  description:
    payload.description === undefined ? null : payload.description ?? null,
  is_active:
    payload.is_active === undefined ? true : Boolean(payload.is_active),
  campaign_id: payload.campaignId || payload.campaign_id || "",
});

export class Service {
  static async list(campaignId?: string) {
    return campaignId
      ? Repository.listByCampaign(campaignId)
      : Repository.list();
  }

  static async show(id: string) {
    const invalid = requireId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const titleError = requireTitle(payload.title);
    if (titleError) return titleError;

    const campaignError = requireCampaignId(
      payload.campaignId || payload.campaign_id
    );
    if (campaignError) return campaignError;

    const insertion = await Repository.create(
      mapPayload({
        ...payload,
        campaign_id: payload.campaign_id,
      })
    );
    if ("error" in insertion) return insertion;

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;
    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = requireId(id);
    if (invalid) return invalid;

    if (payload.title !== undefined && !payload.title.trim()) {
      return { status: 400, error: "Track title cannot be empty" };
    }

    const updates: Partial<InitiativeTrackInsert> = {};
    if (payload.title) updates.title = payload.title.trim();
    if (payload.description !== undefined)
      updates.description = payload.description;
    if (payload.is_active !== undefined)
      updates.is_active = Boolean(payload.is_active);
    if (payload.campaignId || payload.campaign_id)
      updates.campaign_id = payload.campaignId || payload.campaign_id!;

    const updateResult = await Repository.update(id, updates);
    if ("error" in updateResult) return updateResult;

    const detail = await Repository.getById(id);
    if ("error" in detail) return detail;
    return { status: 200, data: detail.data };
  }

  static async destroy(id: string) {
    const invalid = requireId(id);
    if (invalid) return invalid;
    return Repository.delete(id);
  }
}
