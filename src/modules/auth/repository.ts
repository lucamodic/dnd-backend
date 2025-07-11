import Admin, { IAdmin } from "../../db/models/Admin"
import { SupabaseRepo } from "../../utils/supabase"

const adminRepo = new SupabaseRepo("admin")

export class Repository {
  static async post(data: IAdmin) {
    return await Admin.create(data)
  }

  static async getByUsername(username: string) {
    return await adminRepo.findOneBy({ username })
  }
}
