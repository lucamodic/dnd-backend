import { IUser } from "../../db/models/User";
import supabase from "../../db";
import { SupabaseRepo } from "../../utils/supabase";
import { mapList, mapSingle } from "../../utils/supabase-helpers";

const repo = new SupabaseRepo("user");

const USER_SELECT = `
  *,
  campaigns:campaign(
    *,
    characters:character(
      *,
      player:player_id(*),
      class:class_id(*)
    )
  )
`;

export class Repository {
  static async post(data: IUser) {
    return await repo.insert<IUser>(data);
  }

  static async patch(data: IUser) {
    if (!data.id) {
      return { status: 400, error: "User id is required" };
    }
    return await repo.update({ id: data.id }, data);
  }

  static async delete(id: string) {
    return await repo.delete({ id });
  }

  static async getById(id: string) {
    return await repo.findOneBy({ id });
  }

  static async getByUsername(username: string) {
    return await repo.findOneBy({ username });
  }

  static async listDetailed() {
    const { data, error } = await supabase
      .from("user")
      .select(USER_SELECT)
      .order("created_at", { ascending: false });
    return mapList(data, error);
  }

  static async getDetailedById(id: string) {
    const { data, error } = await supabase
      .from("user")
      .select(USER_SELECT)
      .eq("id", id)
      .single();
    return mapSingle(data, error);
  }
}
