import User, { IUser } from "../../db/models/User";
import { SupabaseRepo } from "../../utils/supabase";

const userRepo = new SupabaseRepo("user");

export class Repository {
  static async post(data: IUser) {
    return await User.create(data);
  }

  static async getByUsername(username: string) {
    return await userRepo.findOneBy({ username });
  }
}
