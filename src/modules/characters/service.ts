import { Repository, CharacterInsert } from "./repository";
import { Repository as PlayerRepository } from "../players/repository";

type Payload = CharacterInsert & {
  playerId?: string;
  playerName?: string;
  campaignId?: string;
  classId?: string;
};

const ensureId = (id?: string) =>
  id && id.trim() ? null : { status: 400, error: "Character id is required" };

const ensureName = (name?: string) =>
  name && name.trim()
    ? null
    : { status: 400, error: "Character name is required" };

const resolveNumeric = (value: any) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const buildPayload = (payload: Payload, playerId?: string): CharacterInsert => ({
  name: payload.name!.trim(),
  player: payload.playerName ?? payload.player ?? null,
  pdf: payload.pdf ?? null,
  ac: resolveNumeric(payload.ac),
  hp: resolveNumeric(payload.hp),
  pp: resolveNumeric(payload.pp),
  level: resolveNumeric(payload.level),
  notes: payload.notes ?? null,
  campaign_id: payload.campaignId ?? payload.campaign_id ?? null,
  player_id: playerId ?? payload.player_id ?? null,
  class_id: payload.classId ?? payload.class_id ?? null,
});

const resolvePlayer = async (payload: Payload) => {
  if (payload.playerId !== undefined) {
    if (!payload.playerId?.trim()) {
      return { status: 400, error: "playerId cannot be empty" };
    }
    return { playerId: payload.playerId };
  }

  if (payload.playerName !== undefined && !payload.playerName.trim()) {
    return { status: 400, error: "playerName cannot be empty" };
  }

  if (payload.playerName) {
    const playerResult = await PlayerRepository.create({
      name: payload.playerName.trim(),
    });

    if ("error" in playerResult) {
      return playerResult;
    }

    return { playerId: (playerResult.data as any).id };
  }

  return {
    error: "playerId or playerName is required to create a character",
    status: 400,
  };
};

export class Service {
  static async list(campaignId?: string) {
    return campaignId
      ? Repository.listByCampaign(campaignId)
      : Repository.list();
  }

  static async show(id: string) {
    const invalid = ensureId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const invalid = ensureName(payload.name);
    if (invalid) return invalid;

    const playerResult = await resolvePlayer(payload);
    if ("error" in playerResult) {
      return playerResult;
    }

    const insertion = await Repository.create(
      buildPayload(payload, playerResult.playerId)
    );

    if ("error" in insertion) {
      return insertion;
    }

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;

    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = ensureId(id);
    if (invalid) return invalid;

    if (payload.name !== undefined && !payload.name?.trim()) {
      return { status: 400, error: "Character name cannot be empty" };
    }

    let playerId: string | undefined;
    if (payload.playerId || payload.playerName) {
      const resolved = await resolvePlayer(payload);
      if ("error" in resolved) {
        return resolved;
      }
      playerId = resolved.playerId;
    }

    const updatePayload: Partial<CharacterInsert> = {};

    if (payload.name) {
      updatePayload.name = payload.name.trim();
    }

    if (payload.notes !== undefined) updatePayload.notes = payload.notes;
    if (payload.pdf !== undefined) updatePayload.pdf = payload.pdf;
    if (payload.campaignId !== undefined) {
      updatePayload.campaign_id = payload.campaignId;
    }
    if (payload.classId !== undefined) {
      updatePayload.class_id = payload.classId;
    }
    if (payload.playerName !== undefined || payload.player !== undefined) {
      updatePayload.player = payload.playerName ?? payload.player ?? null;
    }

    if (playerId) {
      updatePayload.player_id = playerId;
    }

    if (payload.level !== undefined)
      updatePayload.level = resolveNumeric(payload.level);
    if (payload.pp !== undefined)
      updatePayload.pp = resolveNumeric(payload.pp);
    if (payload.hp !== undefined)
      updatePayload.hp = resolveNumeric(payload.hp);
    if (payload.ac !== undefined)
      updatePayload.ac = resolveNumeric(payload.ac);

    const updateResult = await Repository.update(id, updatePayload);
    if ("error" in updateResult) return updateResult;

    const detail = await Repository.getById(id);
    if ("error" in detail) return detail;

    return { status: 200, data: detail.data };
  }

  static async destroy(id: string) {
    const invalid = ensureId(id);
    if (invalid) return invalid;
    return Repository.delete(id);
  }
}
