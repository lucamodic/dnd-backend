import { EncounterInsert, Repository } from "./repository";

type Payload = Partial<EncounterInsert> & {
  trackId?: string;
  track_id?: string;
  startedAt?: string;
  endedAt?: string;
};

const requireId = (id?: string) =>
  id && id.trim() ? null : { status: 400, error: "Encounter id is required" };

const requireName = (name?: string | null) =>
  name && name.trim()
    ? null
    : { status: 400, error: "Encounter name is required" };

const requireTrackId = (trackId?: string) =>
  trackId && trackId.trim()
    ? null
    : { status: 400, error: "trackId is required" };

const normalizeDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const mapPayload = (payload: Payload): EncounterInsert => ({
  name: payload.name!.trim(),
  notes: payload.notes ?? null,
  round: typeof payload.round === "number" ? payload.round : 1,
  status: payload.status ?? "active",
  started_at: payload.started_at ?? payload.startedAt ?? null,
  ended_at: payload.ended_at ?? payload.endedAt ?? null,
  track_id: payload.trackId || payload.track_id || "",
});

export class Service {
  static async list(trackId?: string) {
    return trackId ? Repository.listByTrack(trackId) : Repository.list();
  }

  static async show(id: string) {
    const invalid = requireId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const nameError = requireName(payload.name);
    if (nameError) return nameError;

    const trackError = requireTrackId(payload.trackId || payload.track_id);
    if (trackError) return trackError;

    const round = payload.round ?? 1;
    if (round <= 0) {
      return { status: 400, error: "Round must be greater than zero" };
    }

    const insertion = await Repository.create(
      mapPayload({
        ...payload,
        round,
        started_at:
          payload.started_at ?? normalizeDate(payload.startedAt ?? undefined),
        ended_at: payload.ended_at ?? normalizeDate(payload.endedAt ?? undefined),
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

    if (payload.name !== undefined && !payload.name.trim()) {
      return { status: 400, error: "Encounter name cannot be empty" };
    }

    const updates: Partial<EncounterInsert> = {};
    if (payload.name) updates.name = payload.name.trim();
    if (payload.notes !== undefined) updates.notes = payload.notes;
    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.round !== undefined) {
      if (payload.round <= 0) {
        return { status: 400, error: "Round must be greater than zero" };
      }
      updates.round = payload.round;
    }
    if (payload.trackId || payload.track_id) {
      updates.track_id = payload.trackId || payload.track_id!;
    }
    if (payload.startedAt !== undefined || payload.started_at !== undefined) {
      updates.started_at =
        payload.started_at ?? normalizeDate(payload.startedAt ?? undefined);
    }
    if (payload.endedAt !== undefined || payload.ended_at !== undefined) {
      updates.ended_at =
        payload.ended_at ?? normalizeDate(payload.endedAt ?? undefined);
    }

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
