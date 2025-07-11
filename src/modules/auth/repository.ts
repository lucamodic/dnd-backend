import Admin, { IAdmin } from "../../db/models/Admin"

export class Repository {
  static async post(data: IAdmin) {
    return await Admin.create(data)
  }

  static async getByUsername(username: string) {
    try {
      const admin = await Admin.findOne({ username })
      return admin ? { admin } : { error: "Admin not found", status: 404 }
    } catch (error) {
      return { error: "Database error", status: 400 }
    }
  }
}
