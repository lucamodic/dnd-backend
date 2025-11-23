import { SupabaseRepo } from "../../utils/supabase";

const repo = new SupabaseRepo("class_spell");

export class ClassSpellRepository {
  static async insert(data: any) {
    return repo.insert(data);
  }
}
