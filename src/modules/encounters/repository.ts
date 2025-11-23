import { CrudRepository } from "../../utils/crud-repository";

export type EncounterInsert = {
  name: string;
  notes?: string | null;
  round?: number;
  status?: string;
  started_at?: string | null;
  ended_at?: string | null;
  track_id: string;
};

const ENCOUNTER_SELECT = `
  *,
  track:track_id(
    *,
    campaign:campaign_id(*)
  ),
  participants:encounter_participant(
    *,
    character:character_id(*),
    monster:monster_id(*),
    campaignMonster:campaign_monster_id(*)
  )
`;

const repo = new CrudRepository<EncounterInsert>(
  "encounter",
  ENCOUNTER_SELECT,
  { orderBy: { column: "created_at", ascending: false } }
);

export class Repository {
  static list() {
    return repo.findAll();
  }

  static listByTrack(trackId: string) {
    return repo.findManyBy("track_id", trackId);
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: EncounterInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<EncounterInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
