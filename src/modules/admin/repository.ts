import { SupabaseRepo } from "../../utils/supabase"
import { IAdmin } from "../../db/models/Admin"

const repo = new SupabaseRepo("admin")

export class Repository {
  static async post(data: IAdmin) {
    return await repo.insert<IAdmin>(data)
  }

  static async patch(data: IAdmin) {
    return await repo.update({ id: data.id }, data)
  }

  static async delete(id: string) {
    return await repo.delete({ id })
  }

  static async getById(id: string) {
    return await repo.findOneBy({ id })
  }

  static async getByUsername(username: string) {
    return await repo.findOneBy({ username })
  }
}
