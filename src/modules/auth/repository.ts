import supabase from "../../db"
import Admin, { IAdmin } from "../../db/models/Admin"

export class Repository {
  static async post(data: IAdmin) {
    return await Admin.create(data)
  }

  static tableName = "admin"

  static async getByUsername(username: string) {
    const { data: admin, error } = await supabase.from(this.tableName).select("*").eq("username", username).single()

    if (error) {
      if (error.code === "PGRST116") return { error: "Admin not found", status: 404 }
      return { error, status: 400 }
    }

    return { admin }
  }
}
