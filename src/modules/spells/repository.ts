import { SupabaseRepo } from "../../utils/supabase";

const repo = new SupabaseRepo("spell");

export class Repository {
  static async insert(data: any) {
    return repo.insert(data);
  }
}
