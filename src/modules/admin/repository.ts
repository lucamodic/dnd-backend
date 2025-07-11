import supabase from "../../db"
import { IAdmin } from "../../db/models/Admin"

export class Repository {
  static tableName = "admin"

  static async post(data: IAdmin) {
    const { data: admin, error } = await supabase.from(this.tableName).insert(data).single()

    if (error) return { error, status: 400 }
    return { admin }
  }

  static async patch(data: IAdmin) {
    const { data: admin, error } = await supabase.from(this.tableName).update(data).eq("id", data.id).single()

    if (error) {
      if (error.code === "PGRST116") return { error: "Admin not found", status: 404 }
      return { error, status: 400 }
    }

    return { admin }
  }

  static async delete(id: string) {
    const { data, error } = await supabase.from(this.tableName).delete().eq("id", id)

    if (error) return { error, status: 400 }
    if (!data) return { error: "Admin not found", status: 404 }

    return { message: "Admin deleted successfully" }
  }

  static async getById(id: string) {
    const { data: admin, error } = await supabase.from(this.tableName).select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") return { error: "Admin not found", status: 404 }
      return { error, status: 400 }
    }

    return { admin }
  }

  static async getByUsername(username: string) {
    const { data: admin, error } = await supabase.from(this.tableName).select("*").eq("username", username).single()

    if (error) {
      if (error.code === "PGRST116") return { error: "Admin not found", status: 404 }
      return { error: "Database error", status: 400 }
    }

    return { admin }
  }
}
