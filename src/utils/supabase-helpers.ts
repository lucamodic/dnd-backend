import type { PostgrestError } from "@supabase/supabase-js";

export type RepositoryResult<T> =
  | { data: T; status?: number }
  | { error: string; status: number };

const resolveStatus = (error: PostgrestError | null, fallback = 400) => {
  if (!error) return fallback;
  if (error.code === "PGRST116") return 404;
  if (error.code === "23505") return 409;
  return fallback;
};

const normalizeError = (error: PostgrestError | null, fallback = 400) => {
  if (!error) {
    return { error: "Unknown database error", status: fallback } as const;
  }
  return {
    error: error.message,
    status: resolveStatus(error, fallback),
  } as const;
};

export const mapSingle = <T>(
  data: T | null,
  error: PostgrestError | null,
  notFoundMessage = "Resource not found"
): RepositoryResult<T> => {
  if (error) {
    return normalizeError(error);
  }

  if (!data) {
    return { error: notFoundMessage, status: 404 };
  }

  return { data };
};

export const mapList = <T>(
  data: T[] | null,
  error: PostgrestError | null
): RepositoryResult<T[]> => {
  if (error) {
    return normalizeError(error);
  }

  return { data: data ?? [] };
};
