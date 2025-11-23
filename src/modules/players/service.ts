import { Repository, PlayerInsert } from "./repository";

type Payload = Partial<PlayerInsert>;

const validateId = (id?: string) =>
  id && id.trim().length > 0
    ? null
    : { status: 400, error: "Player id is required" };

const validateName = (name?: string | null) =>
  name && name.trim().length > 0
    ? null
    : { status: 400, error: "Player name is required" };

export class Service {
  static async list() {
    return Repository.list();
  }

  static async show(id: string) {
    const invalid = validateId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const invalid = validateName(payload.name);
    if (invalid) return invalid;

    const insertion = await Repository.create({
      name: payload.name!.trim(),
    });

    if ("error" in insertion) {
      return insertion;
    }

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) {
      return detail;
    }

    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = validateId(id);
    if (invalid) return invalid;

    if (payload.name && !payload.name.trim()) {
      return { status: 400, error: "Player name cannot be empty" };
    }

    const updateResult = await Repository.update(id, {
      ...payload,
      name: payload.name?.trim(),
    });

    if ("error" in updateResult) {
      return updateResult;
    }

    const detail = await Repository.getById(id);
    if ("error" in detail) {
      return detail;
    }

    return { status: 200, data: detail.data };
  }

  static async destroy(id: string) {
    const invalid = validateId(id);
    if (invalid) return invalid;
    return Repository.delete(id);
  }
}
