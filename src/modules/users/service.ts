import { IUser } from "../../db/models/User";
import { Repository } from "./repository";
import bcrypt from "bcrypt";

export class Service {
  static async list() {
    return Repository.listDetailed();
  }

  static async getById(id: string) {
    if (!id) {
      return { status: 400, error: "User id is required" };
    }
    return Repository.getDetailedById(id);
  }

  static async post(data: IUser) {
    if (!data.email) {
      return { status: 400, error: "Email is required" };
    }

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
}
