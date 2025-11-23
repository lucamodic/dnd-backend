import { CrudRepository } from "../../utils/crud-repository";

export type InitiativeTrackInsert = {
  title: string;
  description?: string | null;
  is_active?: boolean;
  campaign_id: string;
};

const INITIATIVE_TRACK_SELECT = `
  *,
  campaign:campaign_id(*),
  encounters:encounter(
    *,
    participants:encounter_participant(
      *,
      character:character_id(*),
      monster:monster_id(*),
      campaignMonster:campaign_monster_id(*)
    )
  )
`;

const repo = new CrudRepository<InitiativeTrackInsert>(
  "initiative_track",
  INITIATIVE_TRACK_SELECT,
  { orderBy: { column: "created_at", ascending: false } }
);

export class Repository {
  static list() {
    return repo.findAll();
  }

  static listByCampaign(campaignId: string) {
    return repo.findManyBy("campaign_id", campaignId);
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: InitiativeTrackInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<InitiativeTrackInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
