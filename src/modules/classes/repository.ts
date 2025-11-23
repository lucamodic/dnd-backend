import supabase from "../../db";
import { SupabaseRepo } from "../../utils/supabase";
import { mapList, mapSingle } from "../../utils/supabase-helpers";

const repo = new SupabaseRepo("class");

const CLASS_SELECT = `
  *,
  spells:class_spell(
    *,
    spell:spell_id(*)
  )
`;

export class Repository {
  static async insert(data: any) {
    return repo.insert(data);
  }
  static async getByIndex(index: string) {
    return repo.findOneBy({ index });
  }

  static async list() {
    const { data, error } = await supabase
      .from("class")
      .select(CLASS_SELECT)
      .order("name", { ascending: true });
    return mapList(data, error);
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("class")
      .select(CLASS_SELECT)
      .eq("id", id)
      .single();
    return mapSingle(data, error);
  }
}
