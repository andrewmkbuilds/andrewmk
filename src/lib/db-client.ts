import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The admin server functions receive their Supabase client from
 * `requireSupabaseAuth`, whose generated context type does not line up with
 * `SupabaseClient` in every query position. This alias does that one cast in a
 * single named place instead of `as any` at each call site.
 */
export type DbClient = SupabaseClient;

export function asDbClient(client: unknown): DbClient {
  return client as DbClient;
}
