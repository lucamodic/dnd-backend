import supabase from "../db";
import { mapList, mapSingle, RepositoryResult } from "./supabase-helpers";

interface CrudRepositoryOptions {
  orderBy?: { column: string; ascending?: boolean };
}

export class CrudRepository<TInsert extends Record<string, any>> {
  constructor(
    private readonly table: string,
    private readonly selectClause: string,
    private readonly options?: CrudRepositoryOptions
  ) {}

  async findAll<TSelected = any>(): Promise<RepositoryResult<TSelected[]>> {
    let query = supabase.from(this.table).select(this.selectClause);
    if (this.options?.orderBy) {
      query = query.order(this.options.orderBy.column, {
        ascending: this.options.orderBy.ascending ?? false,
      });
    }
    const { data, error } = await query;
    return mapList<TSelected>(data as TSelected[] | null, error);
  }

  async findById<TSelected = any>(
    id: string
  ): Promise<RepositoryResult<TSelected>> {
    const { data, error } = await supabase
      .from(this.table)
      .select(this.selectClause)
      .eq("id", id)
      .single();

    return mapSingle<TSelected>(data as TSelected | null, error);
  }

  async findManyBy<TSelected = any>(
    column: string,
    value: any
  ): Promise<RepositoryResult<TSelected[]>> {
    let query = supabase
      .from(this.table)
      .select(this.selectClause)
      .eq(column, value);

    if (this.options?.orderBy) {
      query = query.order(this.options.orderBy.column, {
        ascending: this.options.orderBy.ascending ?? false,
      });
    }

    const { data, error } = await query;
    return mapList<TSelected>(data as TSelected[] | null, error);
  }

  async insert<TSelected = any>(
    payload: TInsert
  ): Promise<RepositoryResult<TSelected>> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();
    return mapSingle<TSelected>(data as TSelected | null, error);
  }

  async update<TSelected = any>(
    id: string,
    payload: Partial<TInsert>
  ): Promise<RepositoryResult<TSelected>> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return mapSingle<TSelected>(data as TSelected | null, error);
  }

  async delete<TSelected = any>(
    id: string
  ): Promise<RepositoryResult<TSelected>> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select()
      .single();
    return mapSingle<TSelected>(data as TSelected | null, error);
  }
}
