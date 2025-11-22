import { IUser } from "../../db/models/User";
import { Repository } from "./repository"

import bcrypt from "bcrypt"

export class Service {
  static async post(data: IUser) {
    if (data.password) {
      const saltRounds = 10;
      const secret = process.env.SECRET || "";
      data.password = await bcrypt.hash(data.password + secret, saltRounds);
    }
    return Repository.post(data);
  }

  static async patch(data: IUser) {
    return Repository.patch(data);
  }

  static async delete(id: string) {
    return Repository.delete(id);
  }

  static async getById(id: string) {
    return Repository.getById(id);
  }
}
