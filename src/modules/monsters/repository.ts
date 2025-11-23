import supabase from "../../db";
import { CrudRepository } from "../../utils/crud-repository";
import { mapList } from "../../utils/supabase-helpers";

export type MonsterInsert = Record<string, any> & {
  user_id?: string | null;
};

const MONSTER_SELECT = `
  *,
  owner:user_id(*),
  campaigns:campaign_monster(
    *,
    campaign:campaign_id(*)
  )
`;

const repo = new CrudRepository<MonsterInsert>("monster", MONSTER_SELECT, {
  orderBy: { column: "created_at", ascending: false },
});

export class Repository {
  static async listAccessible(userId?: string) {
    if (!userId) {
      return repo.findAll();
    }

    const { data, error } = await supabase
      .from("monster")
      .select(MONSTER_SELECT)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    return mapList(data, error);
  }

  static list() {
    return repo.findAll();
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: MonsterInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<MonsterInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }

  // Alias used by the import service for backward compatibility.
  static insert(data: MonsterInsert) {
    return repo.insert(data);
  }
}
