import { IUser } from "../../db/models/User";
import { SupabaseRepo } from "../../utils/supabase";

const userRepo = new SupabaseRepo("user");

export class Repository {
  static async createUser(data: Partial<IUser>) {
    return await userRepo.insert<Partial<IUser>>(data);
  }

  static async getByUsername(username: string) {
    return await userRepo.findOneBy<IUser>({ username });
  }

  static async getByEmail(email: string) {
    return await userRepo.findOneBy<IUser>({ email });
  }

  static async getByVerificationToken(token: string) {
    return await userRepo.findOneBy<IUser>({ email_verification_token: token });
  }

  static async updateUser(filter: Record<string, any>, data: Partial<IUser>) {
    return await userRepo.update<Partial<IUser>>(filter, data);
  }
}
