import { IUser } from "../../db/models/User"
import { SupabaseRepo } from "../../utils/supabase"

const repo = new SupabaseRepo("user")

export class Repository {
  static async post(data: IUser) {
    return await repo.insert<IUser>(data)
  }

  static async patch(data: IUser) {
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
