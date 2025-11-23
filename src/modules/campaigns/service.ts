import { CampaignInsert, Repository } from "./repository";

type Payload = Partial<Omit<CampaignInsert, "user_id">>;

const validateId = (id?: string) =>
  id && id.trim()
    ? null
    : { status: 400, error: "Campaign id is required" };

const ensureTitle = (title?: string | null) =>
  title && title.trim()
    ? null
    : { status: 400, error: "Campaign title is required" };

export class Service {
  static async list(userId?: string) {
    return userId ? Repository.listByUser(userId) : Repository.list();
  }

  static async show(id: string) {
    const invalid = validateId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload, ownerId?: string) {
    if (!ownerId) {
      return { status: 401, error: "Missing authenticated user" };
    }

    const invalidTitle = ensureTitle(payload.title || null);
    if (invalidTitle) return invalidTitle;

    const insertion = await Repository.create({
      title: payload.title!.trim(),
      notes: payload.notes ?? null,
      user_id: ownerId,
    });

    if ("error" in insertion) {
      return insertion;
    }

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;

    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = validateId(id);
    if (invalid) return invalid;

    if (payload.title !== undefined && !payload.title.trim()) {
      return { status: 400, error: "Campaign title cannot be empty" };
    }

    const updates: Partial<CampaignInsert> = {};

    if (payload.title) {
      updates.title = payload.title.trim();
    }

    if (payload.notes !== undefined) {
      updates.notes = payload.notes;
    }

    const updateResult = await Repository.update(id, updates);
    if ("error" in updateResult) return updateResult;

    const detail = await Repository.getById(id);
    if ("error" in detail) return detail;

    return { status: 200, data: detail.data };
  }

  static async destroy(id: string) {
    const invalid = validateId(id);
    if (invalid) return invalid;
    return Repository.delete(id);
  }
}
