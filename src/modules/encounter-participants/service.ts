import { EncounterParticipantInsert, Repository } from "./repository";
import { Repository as CharacterRepository } from "../characters/repository";
import { Repository as MonstersRepository } from "../monsters/repository";
import { Repository as CampaignMonstersRepository } from "../campaign-monsters/repository";

type ParticipantType = EncounterParticipantInsert["participant_type"];

type Payload = Partial<EncounterParticipantInsert> & {
  encounterId?: string;
  encounter_id?: string;
  participantType?: ParticipantType;
  characterId?: string;
  monsterId?: string;
  campaignMonsterId?: string;
  hpCurrent?: number | null;
  hpMax?: number | null;
  armorClass?: number | null;
  sortOrder?: number | null;
  isActive?: boolean;
};

const requireId = (id?: string) =>
  id && id.trim()
    ? null
    : { status: 400, error: "Encounter participant id is required" };

const requireEncounterId = (encounterId?: string) =>
  encounterId && encounterId.trim()
    ? null
    : { status: 400, error: "encounterId is required" };

const requireType = (type?: string) =>
  type && ["character", "monster", "custom"].includes(type)
    ? null
    : {
        status: 400,
        error: "participantType must be character, monster or custom",
      };

const normalizeName = (name?: string | null) =>
  name && name.trim().length ? name.trim() : undefined;

const fetchCharacterWithStats = async (id: string) => {
  const character = await CharacterRepository.getById(id);
  if ("error" in character) return character;
  const record = character.data as any;
  const name = record?.name;
  if (!name) return { status: 404, error: "Character not found" };
  return { name: String(name), record };
};

const buildPayload = (
  payload: Payload,
  resolvedName: string
): EncounterParticipantInsert => ({
  encounter_id: payload.encounterId || payload.encounter_id || "",
  participant_type:
    payload.participantType || payload.participant_type || "custom",
  name: resolvedName,
  character_id: payload.characterId ?? payload.character_id ?? null,
  monster_id: payload.monsterId ?? payload.monster_id ?? null,
  campaign_monster_id:
    payload.campaignMonsterId ?? payload.campaign_monster_id ?? null,
  initiative: payload.initiative ?? 0,
  hp_current: payload.hpCurrent ?? payload.hp_current ?? null,
  hp_max: payload.hpMax ?? payload.hp_max ?? null,
  armor_class: payload.armorClass ?? payload.armor_class ?? null,
  is_active: payload.isActive ?? payload.is_active ?? true,
  sort_order: payload.sortOrder ?? payload.sort_order ?? null,
  notes: payload.notes ?? null,
});

const fetchCharacterName = async (id: string) => {
  const character = await CharacterRepository.getById(id);
  if ("error" in character) return character;
  const name = (character.data as any)?.name;
  if (!name) return { status: 404, error: "Character not found" };
  return { name: String(name) };
};

const fetchMonsterName = async (monsterId: string) => {
  const monster = await MonstersRepository.getById(monsterId);
  if ("error" in monster) return monster;
  const name = (monster.data as any)?.name;
  if (!name) return { status: 404, error: "Monster not found" };
  return { name: String(name) };
};

const fetchCampaignMonsterName = async (campaignMonsterId: string) => {
  const campaignMonster =
    await CampaignMonstersRepository.getById(campaignMonsterId);
  if ("error" in campaignMonster) return campaignMonster;
  const record = campaignMonster.data as any;
  const name =
    record?.monster?.name || record?.monster_name || record?.name || null;
  if (!name) return { status: 404, error: "Campaign monster not found" };
  return { name: String(name) };
};

const resolveName = async (
  payload: Payload,
  type: ParticipantType
): Promise<{ name: string } | { status: number; error: string }> => {
  const directName = normalizeName(payload.name);
  if (directName) {
    return { name: directName };
  }

  if (type === "character" && (payload.characterId || payload.character_id)) {
    return fetchCharacterName(payload.characterId || payload.character_id!);
  }

  if (type === "monster") {
    if (payload.campaignMonsterId || payload.campaign_monster_id) {
      return fetchCampaignMonsterName(
        payload.campaignMonsterId || payload.campaign_monster_id!
      );
    }
    if (payload.monsterId || payload.monster_id) {
      return fetchMonsterName(payload.monsterId || payload.monster_id!);
    }
  }

  return {
    status: 400,
    error: "name is required for custom participants",
  };
};

export class Service {
  static async list(encounterId?: string) {
    return encounterId
      ? Repository.listByEncounter(encounterId)
      : Repository.list();
  }

  static async show(id: string) {
    const invalid = requireId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: Payload) {
    const encounterError = requireEncounterId(
      payload.encounterId || payload.encounter_id
    );
    if (encounterError) return encounterError;

    const type =
      (payload.participantType ||
        payload.participant_type ||
        "custom") as ParticipantType;
    const typeError = requireType(type);
    if (typeError) return typeError;

    if (type === "character" && !(payload.characterId || payload.character_id)) {
      return { status: 400, error: "characterId is required" };
    }

    if (
      type === "monster" &&
      !(
        payload.monsterId ||
        payload.monster_id ||
        payload.campaignMonsterId ||
        payload.campaign_monster_id
      )
    ) {
      return {
        status: 400,
        error: "monsterId or campaignMonsterId is required",
      };
    }

    let characterRecord: any | undefined;
    let nameResult: { name: string } | { status: number; error: string };

    if (type === "character") {
      const characterId = payload.characterId || payload.character_id;
      const character = await fetchCharacterWithStats(characterId!);
      if ("error" in character) return character;
      characterRecord = character.record;
      nameResult = { name: normalizeName(payload.name) ?? character.name };
    } else {
      nameResult = await resolveName(payload, type);
    }

    if ("error" in nameResult) return nameResult;

    const basePayload = buildPayload(
      {
        ...payload,
        participant_type: type,
        name: nameResult.name,
      },
      nameResult.name
    );

    if (type === "character" && characterRecord) {
      if (basePayload.hp_current == null && characterRecord.hp !== undefined) {
        basePayload.hp_current = characterRecord.hp ?? null;
      }
      if (basePayload.hp_max == null && characterRecord.hp !== undefined) {
        basePayload.hp_max = characterRecord.hp ?? null;
      }
      if (
        basePayload.armor_class == null &&
        characterRecord.ac !== undefined
      ) {
        basePayload.armor_class = characterRecord.ac ?? null;
      }
    }

    const insertion = await Repository.create(basePayload);
    if ("error" in insertion) return insertion;

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;
    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: Payload) {
    const invalid = requireId(id);
    if (invalid) return invalid;

    const updates: Partial<EncounterParticipantInsert> = {};

    if (payload.encounterId || payload.encounter_id) {
      updates.encounter_id = payload.encounterId || payload.encounter_id!;
    }

    if (payload.participantType || payload.participant_type) {
      const type = (payload.participantType ||
        payload.participant_type) as ParticipantType;
      const typeError = requireType(type);
      if (typeError) return typeError;
      updates.participant_type = type;
      if (type === "character" && !(payload.characterId || payload.character_id)) {
        return { status: 400, error: "characterId is required" };
      }
      if (
        type === "monster" &&
        !(
          payload.monsterId ||
          payload.monster_id ||
          payload.campaignMonsterId ||
          payload.campaign_monster_id
        )
      ) {
        return {
          status: 400,
          error: "monsterId or campaignMonsterId is required",
        };
      }
    }

    if (payload.characterId !== undefined || payload.character_id !== undefined) {
      updates.character_id = payload.characterId ?? payload.character_id ?? null;
    }
    if (payload.monsterId !== undefined || payload.monster_id !== undefined) {
      updates.monster_id = payload.monsterId ?? payload.monster_id ?? null;
    }
    if (
      payload.campaignMonsterId !== undefined ||
      payload.campaign_monster_id !== undefined
    ) {
      updates.campaign_monster_id =
        payload.campaignMonsterId ?? payload.campaign_monster_id ?? null;
    }

    if (payload.name !== undefined) {
      const trimmed = normalizeName(payload.name);
      if (!trimmed) {
        return { status: 400, error: "name cannot be empty" };
      }
      updates.name = trimmed;
    }

    if (payload.initiative !== undefined) {
      updates.initiative = payload.initiative;
    }
    if (payload.hpCurrent !== undefined || payload.hp_current !== undefined) {
      updates.hp_current = payload.hpCurrent ?? payload.hp_current ?? null;
    }
    if (payload.hpMax !== undefined || payload.hp_max !== undefined) {
      updates.hp_max = payload.hpMax ?? payload.hp_max ?? null;
    }
    if (
      payload.armorClass !== undefined ||
      payload.armor_class !== undefined
    ) {
      updates.armor_class = payload.armorClass ?? payload.armor_class ?? null;
    }
    if (payload.isActive !== undefined || payload.is_active !== undefined) {
      updates.is_active = payload.isActive ?? payload.is_active ?? true;
    }
    if (payload.sortOrder !== undefined || payload.sort_order !== undefined) {
      updates.sort_order = payload.sortOrder ?? payload.sort_order ?? null;
    }
    if (payload.notes !== undefined) {
      updates.notes = payload.notes;
    }

    if (!Object.keys(updates).length) {
      return { status: 400, error: "No participant fields provided to update" };
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
