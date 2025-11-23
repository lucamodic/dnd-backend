import axios from "axios";
import { Repository, MonsterInsert } from "./repository";
import { DND_API_BASE_URL } from "../../utils/constants";

const MONSTER_COLUMNS = [
  "index",
  "name",
  "size",
  "type",
  "alignment",
  "armor_class",
  "hit_points",
  "hit_dice",
  "speed",
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
  "proficiencies",
  "damage_vulnerabilities",
  "damage_resistances",
  "damage_immunities",
  "condition_immunities",
  "senses",
  "languages",
  "challenge_rating",
  "proficiency_bonus",
  "xp",
  "special_abilities",
  "actions",
  "legendary_actions",
  "reactions",
  "image",
  "user_id",
];

const CAMEL_TO_SNAKE: Record<string, string> = {
  armorClass: "armor_class",
  hitPoints: "hit_points",
  hitDice: "hit_dice",
  damageVulnerabilities: "damage_vulnerabilities",
  damageResistances: "damage_resistances",
  damageImmunities: "damage_immunities",
  conditionImmunities: "condition_immunities",
  challengeRating: "challenge_rating",
  proficiencyBonus: "proficiency_bonus",
  specialAbilities: "special_abilities",
  legendaryActions: "legendary_actions",
  userId: "user_id",
};

const normalizeMonsterPayload = (
  source: any,
  ownerId?: string | null
): MonsterInsert => {
  const data: MonsterInsert = {};
  if (!source || typeof source !== "object") return data;

  for (const column of MONSTER_COLUMNS) {
    if (source[column] !== undefined) {
      data[column] = source[column];
    }
  }

  for (const [camel, snake] of Object.entries(CAMEL_TO_SNAKE)) {
    if (source[camel] !== undefined && data[snake] === undefined) {
      data[snake] = source[camel];
    }
  }

  if (ownerId !== undefined) {
    data.user_id = ownerId;
  }

  return data;
};

const ensureId = (id?: string) =>
  id && id.trim() ? null : { status: 400, error: "Monster id is required" };

const ensureName = (name?: string) =>
  name && name.trim()
    ? null
    : { status: 400, error: "Monster name is required" };

const ensureIndex = (index?: string) =>
  index && index.trim()
    ? null
    : { status: 400, error: "Monster index is required" };

export class Service {
  static async list(userId?: string) {
    return Repository.listAccessible(userId);
  }

  static async show(id: string) {
    const invalid = ensureId(id);
    if (invalid) return invalid;
    return Repository.getById(id);
  }

  static async create(payload: any, userId?: string) {
    const invalidName = ensureName(payload?.name);
    if (invalidName) return invalidName;

    const invalidIndex = ensureIndex(payload?.index);
    if (invalidIndex) return invalidIndex;

    const data = normalizeMonsterPayload(payload, userId ?? null);
    data.name = payload.name.trim();
    data.index = payload.index.trim();

    const insertion = await Repository.create(data);
    if ("error" in insertion) return insertion;

    const detail = await Repository.getById((insertion.data as any).id);
    if ("error" in detail) return detail;

    return { status: 201, data: detail.data };
  }

  static async update(id: string, payload: any) {
    const invalid = ensureId(id);
    if (invalid) return invalid;

    const updates = normalizeMonsterPayload(payload);
    if (payload?.name !== undefined) {
      if (!payload.name.trim()) {
        return { status: 400, error: "Monster name cannot be empty" };
      }
      updates.name = payload.name.trim();
    }

    if (payload?.index !== undefined) {
      if (!payload.index.trim()) {
        return { status: 400, error: "Monster index cannot be empty" };
      }
      updates.index = payload.index.trim();
    }

    if (!Object.keys(updates).length) {
      return { status: 400, error: "No monster fields provided for update" };
    }

    const updateResult = await Repository.update(id, updates);
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

  static async importAll() {
    const list = await axios.get(`${DND_API_BASE_URL}/api/monsters`);
    const monsters = list.data.results;

    const inserted = [];

    for (const m of monsters) {
      try {
        const full = await axios.get(`${DND_API_BASE_URL}${m.url}`);
        const monster = full.data;

        let armorClass = null;
        if (Array.isArray(monster.armor_class)) {
          armorClass = monster.armor_class[0]?.value ?? null;
        } else if (typeof monster.armor_class === "number") {
          armorClass = monster.armor_class;
        }

        const data = normalizeMonsterPayload({
          index: monster.index,
          name: monster.name,
          size: monster.size,
          type: monster.type,
          alignment: monster.alignment,
          armor_class: armorClass,
          hit_points: monster.hit_points,
          hit_dice: monster.hit_dice,
          speed: monster.speed || {},
          strength: monster.strength,
          dexterity: monster.dexterity,
          constitution: monster.constitution,
          intelligence: monster.intelligence,
          wisdom: monster.wisdom,
          charisma: monster.charisma,
          proficiencies: monster.proficiencies || [],
          damage_vulnerabilities: monster.damage_vulnerabilities || [],
          damage_resistances: monster.damage_resistances || [],
          damage_immunities: monster.damage_immunities || [],
          condition_immunities: monster.condition_immunities || [],
          senses: monster.senses || {},
          languages: monster.languages || null,
          challenge_rating: monster.challenge_rating,
          proficiency_bonus: monster.proficiency_bonus,
          xp: monster.xp,
          special_abilities: monster.special_abilities || [],
          actions: monster.actions || [],
          legendary_actions: monster.legendary_actions || [],
          reactions: monster.reactions || [],
          image: monster.image || null,
        });

        const result = await Repository.insert(data);
        inserted.push(result);
      } catch (err) {
        console.log("Error importing", m.index);
      }
    }

    return { imported: inserted.length };
  }
}
