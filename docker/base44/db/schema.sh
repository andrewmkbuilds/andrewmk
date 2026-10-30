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

# No Supabase Storage service runs in this stack, so the handful of
# storage.objects policies in apply_all.sql fail with "relation does not exist".
# psql continues past them; every app table, policy and seed row still applies.
psql "$url" -f /sql/apply_all.sql

if [ "$(psql "$url" -tAc "SELECT to_regclass('public.blog_posts') IS NOT NULL")" != "t" ]; then
  echo "schema: apply_all.sql did not create the app tables" >&2
  exit 1
fi

echo "schema: applied supabase/apply_all.sql"
