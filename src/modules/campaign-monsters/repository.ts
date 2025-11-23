import { CrudRepository } from "../../utils/crud-repository";

export type CampaignMonsterInsert = {
  campaign_id: string;
  monster_id: string;
};

const CAMPAIGN_MONSTER_SELECT = `
  *,
  campaign:campaign_id(*),
  monster:monster_id(*)
`;

const repo = new CrudRepository<CampaignMonsterInsert>(
  "campaign_monster",
  CAMPAIGN_MONSTER_SELECT,
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

  static create(data: CampaignMonsterInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<CampaignMonsterInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
