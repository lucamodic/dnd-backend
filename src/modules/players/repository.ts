import supabase from "../../db";
import { CrudRepository } from "../../utils/crud-repository";
import { mapList } from "../../utils/supabase-helpers";

export type PlayerInsert = {
  name: string;
  user_id?: string | null;
};

const PLAYER_SELECT = `
  *,
  characters:character(
    *,
    campaign:campaign_id(*),
    class:class(*)
  )
`;

const repo = new CrudRepository<PlayerInsert>("player", PLAYER_SELECT, {
  orderBy: { column: "created_at", ascending: false },
});

export class Repository {
  static list() {
    return repo.findAll();
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static async listVisible(userId?: string) {
    if (!userId) {
      return repo.findAll();
    }

    const { data, error } = await supabase
      .from("player")
      .select(PLAYER_SELECT)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    return mapList(data, error);
  }

  static create(data: PlayerInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<PlayerInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
