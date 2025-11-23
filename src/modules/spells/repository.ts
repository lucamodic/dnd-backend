import supabase from "../../db";
import { SupabaseRepo } from "../../utils/supabase";
import { mapList, mapSingle } from "../../utils/supabase-helpers";

const repo = new SupabaseRepo("spell");

const SPELL_SELECT = `
  *,
  classes:class_spell(
    *,
    class:class_id(*)
  )
`;

export class Repository {
  static async insert(data: any) {
    return repo.insert(data);
  }

  static async list() {
    const { data, error } = await supabase
      .from("spell")
      .select(SPELL_SELECT)
      .order("level", { ascending: true })
      .order("name", { ascending: true });
    return mapList(data, error);
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("spell")
      .select(SPELL_SELECT)
      .eq("id", id)
      .single();
    return mapSingle(data, error);
  }
}
