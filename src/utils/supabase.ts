import supabase from "../db"

type Filter = Record<string, string | number | boolean>

export class SupabaseRepo {
  constructor(private tableName: string) {}

  async findOneBy<T = any>(filter: Filter): Promise<{ error: string; status: number } | T> {
    const { data, error } = await supabase.from(this.tableName).select("*").match(filter).single()

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 400
      return { error: error.message, status }
    }

    return data as T
  }

  async insert<T>(payload: T): Promise<{ error: string; status: number } | { data: T }> {
    const { data, error } = await supabase.from(this.tableName).insert(payload).select().single()

    if (error) {
      return { error: error.message, status: 400 }
    }

    return { data: data as T }
  }

  async update<T>(filter: Filter, updates: T): Promise<{ error: string; status: number } | { data: T }> {
    const { data, error } = await supabase.from(this.tableName).update(updates).match(filter).select().single()

    if (error) {
      return { error: error.message, status: 400 }
    }

    return { data: data as T }
  }

  async delete(filter: Filter): Promise<{ error: string; status: number } | { data: any }> {
    const { data, error } = await supabase.from(this.tableName).delete().match(filter).select().single()

    if (error) {
      return { error: error.message, status: 400 }
    }

    return { data }
  }
}
