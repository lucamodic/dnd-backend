import supabase from "../../db";
import { CrudRepository } from "../../utils/crud-repository";
import { mapList } from "../../utils/supabase-helpers";

export type CharacterInsert = {
  name: string;
  pdf?: string | null;
  ac?: number | null;
  hp?: number | null;
  pp?: number | null;
  level?: number | null;
  notes?: string | null;
  campaign_id?: string | null;
  player_id?: string | null;
  class_id?: string | null;
  user_id?: string | null;
};

const CHARACTER_SELECT = `
  *,
  player:player_id(*),
  campaign:campaign_id(*),
  class:class_id(*)
`;

const repo = new CrudRepository<CharacterInsert>(
  "character",
  CHARACTER_SELECT,
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

  static async listByUser(userId: string) {
    const { data, error } = await supabase
      .from("character")
      .select(CHARACTER_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return mapList(data, error);
  }

  static create(data: CharacterInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<CharacterInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
