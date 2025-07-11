import { Repository } from "./repository"
import { IAdmin } from "../../db/models/Admin"
import bcrypt from "bcrypt"

export class Service {
  static async post(data: IAdmin) {
    if (data.password) {
      const saltRounds = 10
      const secret = process.env.SECRET || ""
      data.password = await bcrypt.hash(data.password + secret, saltRounds)
    }
    return Repository.post(data)
  }

  static async patch(data: IAdmin) {
    return Repository.patch(data)
  }

  static async delete(id: string) {
    return Repository.delete(id)
  }

  static async getById(id: string) {
    return Repository.getById(id)
  }
}
