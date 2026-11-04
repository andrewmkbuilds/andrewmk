-- Roles the Supabase stack expects. Created before GoTrue/PostgREST start so
-- their migrations and RLS policies have somewhere to land.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
  -- PostgREST connects as `authenticator` and SET ROLEs into the JWT's role.
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator LOGIN NOINHERIT PASSWORD 'postgres';
  END IF;
END
$$;

GRANT anon, authenticated, service_role TO authenticator;

-- GoTrue migrates with search_path=auth, so the schema and its Pop migration
-- metadata table must exist first. Creating this empty, final-shape table stops
-- GoTrue's initial existence probe from emitting a harmless missing-relation
-- database error; GoTrue records all its migrations into it as usual.
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.schema_migrations (
  version varchar(14) NOT NULL PRIMARY KEY
);
CREATE UNIQUE INDEX IF NOT EXISTS schema_migrations_version_idx
  ON auth.schema_migrations (version);
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
