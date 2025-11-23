import { CrudRepository } from "../../utils/crud-repository";

export type EncounterParticipantInsert = {
  encounter_id: string;
  participant_type: "character" | "monster" | "custom";
  name: string;
  character_id?: string | null;
  monster_id?: string | null;
  campaign_monster_id?: string | null;
  initiative?: number;
  hp_current?: number | null;
  hp_max?: number | null;
  armor_class?: number | null;
  is_active?: boolean;
  sort_order?: number | null;
  notes?: string | null;
};

const PARTICIPANT_SELECT = `
  *,
  encounter:encounter_id(
    *,
    track:track_id(
      *,
      campaign:campaign_id(*)
    )
  ),
  character:character_id(*),
  monster:monster_id(*),
  campaignMonster:campaign_monster_id(*)
`;

const repo = new CrudRepository<EncounterParticipantInsert>(
  "encounter_participant",
  PARTICIPANT_SELECT,
  { orderBy: { column: "created_at", ascending: false } }
);

export class Repository {
  static list() {
    return repo.findAll();
  }

  static listByEncounter(encounterId: string) {
    return repo.findManyBy("encounter_id", encounterId);
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: EncounterParticipantInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<EncounterParticipantInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
