import { CrudRepository } from "../../utils/crud-repository";

export type CampaignInsert = {
  title: string;
  notes?: string | null;
  user_id: string;
};

const CAMPAIGN_SELECT = `
  *,
  owner:user_id(*),
  characters:character(
    *,
    player:player_id(*),
    class:class_id(*)
  ),
  encounters:campaign_monster(
    *,
    monster:monster_id(*)
  ),
  initiativeTracks:initiative_track(
    *,
    encounters:encounter(
      *,
      participants:encounter_participant(
        *,
        character:character_id(*),
        monster:monster_id(*),
        campaignMonster:campaign_monster_id(*)
      )
    )
  )
`;

const repo = new CrudRepository<CampaignInsert>("campaign", CAMPAIGN_SELECT, {
  orderBy: { column: "created_at", ascending: false },
});

export class Repository {
  static list() {
    return repo.findAll();
  }

  static listByUser(userId: string) {
    return repo.findManyBy("user_id", userId);
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: CampaignInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<CampaignInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
