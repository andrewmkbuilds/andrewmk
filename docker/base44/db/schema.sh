#!/bin/sh
# Applies the app schema once per database volume.
#
# supabase/apply_all.sql is a concatenation of every migration and is idempotent
# for the schema, but its blog_posts seed rows are plain INSERTs, so it is only
# run on a database that has not been initialised yet. Recreate the volume
# (`docker compose -f docker-compose.base44.yml down -v`) to re-run it.
set -eu

url="postgres://postgres:${PGPASSWORD}@db:5432/postgres"

psql "$url" -v ON_ERROR_STOP=1 -q -f /sql/prelude.sql

if [ "$(psql "$url" -tAc "SELECT to_regclass('public.blog_posts') IS NOT NULL")" = "t" ]; then
  echo "schema: already initialised, skipping supabase/apply_all.sql"
  exit 0
fi

# Stop on the first error: prelude.sql provides the auth helpers and the
# storage-schema stub the migrations' storage policies need, so a clean run
# should have none.
psql "$url" -q -v ON_ERROR_STOP=1 -f /sql/apply_all.sql

if [ "$(psql "$url" -tAc "SELECT to_regclass('public.blog_posts') IS NOT NULL")" != "t" ]; then
  echo "schema: apply_all.sql did not create the app tables" >&2
  exit 1
fi

echo "schema: applied supabase/apply_all.sql"
