import { SupabaseRepo } from "../../utils/supabase";

const repo = new SupabaseRepo("monster");

export class Repository {
  static async insert(data: any) {
    return await repo.insert(data);
  }
}
