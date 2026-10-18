-- =====================================================================
-- Base44 portfolio — one-shot schema setup for a fresh Supabase project.
-- ---------------------------------------------------------------------
-- Paste this entire script into the Supabase Dashboard SQL Editor and
-- Run. It is idempotent (safe to run more than once) and creates every
-- table, policy, trigger and seed row the site needs:
--   contact_messages, user_roles, admin_audit_log, blog_posts,
--   projects, media_assets  +  the admin bootstrap + signup lockdown.
--
-- AFTER running this:
--   1. Open /auth, click "Create the admin account", sign up with your
--      email + password. The first account is auto-promoted to admin.
--   2. Public registration is now locked at the database level — only
--      your first admin exists. To add another user later, temporarily
--      drop the on_auth_user_created_block_signup trigger.
-- This file is a concatenation of every file in supabase/migrations/.
-- =====================================================================

-- =============================================================
-- 20260830143005_32f7a789-be28-42bc-9a19-db2c45c08c74.sql
-- =============================================================
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_path TEXT,
  user_agent TEXT,
  client_hash TEXT,
  spam_score INTEGER NOT NULL DEFAULT 0,
  delivery_status TEXT NOT NULL DEFAULT 'stored',
  delivery_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX contact_messages_client_hash_idx ON public.contact_messages (client_hash, created_at DESC);

GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 20260830152514_019f887b-5b7b-4787-8b8f-f12eac08eddf.sql
-- =============================================================
-- Admin triage fields for contact submissions
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS handled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS handled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admin_note TEXT;

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS contact_messages_handled_idx ON public.contact_messages (handled_at);

-- =============================================================
-- 20260830152527_6bb3ec0f-8277-49a5-88bc-9e473e759bd1.sql
-- =============================================================
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- =============================================================
-- 20260830152830_c456ad8c-03d6-4314-8bd6-39628b1c80d0.sql
-- =============================================================
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- =============================================================
-- 20260830160228_c13ec7fc-9cd3-44d2-9fe3-0552c08a5093.sql
-- =============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL DEFAULT 'contact_message',
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_entity_idx ON public.admin_audit_log (entity, entity_id);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read the audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can read the audit log"
ON public.admin_audit_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- 20260831191019_69df8e0f-5a0c-43fd-b74f-91d6b5b942ef.sql
-- =============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  reading_minutes INT NOT NULL DEFAULT 3,
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins can read all posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX blog_posts_published_idx ON public.blog_posts (published, published_at DESC);

INSERT INTO public.blog_posts (slug, title, excerpt, content, tags, published, published_at, reading_minutes)
VALUES
 ('why-i-build-systems-not-apps',
  'Why I Build Systems, Not Apps',
  'Most side projects die because they solve a feature, not a workflow. Here is how I pick what to build.',
  E'Most side projects die because they solve a feature, not a workflow.\n\nWhen I start something new I write down the loop a real person repeats every week. If the loop is boring, painful, and frequent, it is worth automating. If it is rare, it is a demo.\n\n## The three filters\n\n1. Does someone already do this manually?\n2. Can I ship a usable version in two weeks?\n3. Does it get better with data over time?\n\nGradr passed all three. A dozen ideas in my notes did not, and that is fine - the filter is the product.',
  ARRAY['Product','Engineering'], true, now() - interval '21 days', 4),
 ('shipping-ai-features-that-do-not-hallucinate',
  'Shipping AI Features That Do Not Hallucinate',
  'Structured outputs, grounded context, and honest fallbacks - the boring stack behind reliable AI features.',
  E'Reliable AI features are mostly engineering, not prompting.\n\n## Ground everything\n\nEvery model call in my projects receives retrieved, verifiable context. If retrieval returns nothing, the feature says so instead of guessing.\n\n## Force structure\n\nI validate model output against a schema before it touches the UI. Anything that fails validation is retried once, then downgraded to a deterministic fallback.\n\n## Make failure visible\n\nA visible "I could not answer that" beats a confident wrong answer every single time.',
  ARRAY['AI','Engineering'], true, now() - interval '9 days', 5),
 ('robotics-lessons-from-a-teenage-workshop',
  'Robotics Lessons From a Teenage Workshop',
  'What building physical systems taught me about software constraints, tolerances, and testing.',
  E'Hardware does not let you pretend.\n\nA loose bolt is a bug you can feel. That physicality changed how I write software: I now assume tolerances, drift, and partial failure everywhere.\n\n## Three habits it gave me\n\n- Test the seams, not the middle.\n- Design for the state where one component is dead.\n- Measure before optimizing - always.',
  ARRAY['Robotics','Learning'], true, now() - interval '3 days', 3);

-- =============================================================
-- 20260901132707_cf7c0db2-63d2-453d-b3ea-f09783b34e57.sql
-- =============================================================
INSERT INTO public.blog_posts (slug, title, excerpt, content, tags, published, published_at, reading_minutes)
VALUES (
  'building-gradr-ai-career-accelerator',
  'Building Gradr: making AI career feedback actually specific',
  'How Gradr went from a spreadsheet workaround to an AI career accelerator — rubric-based resume scoring, honest ATS analysis, cost control and privacy by design.',
  'Gradr started as a spreadsheet.

I was tracking applications in one tab, keeping three versions of my resume in another, and getting no useful feedback from either. The advice online was always the same: "tailor your resume", "practise your answers". Nobody said which line was weak, or why an application never got a reply. That gap is what Gradr is built to close.

## What it actually is

Gradr is an AI career accelerator for students, graduates and early-career candidates. It does four things that normally live in four different places:

- **Resume analysis** — upload a resume, get an ATS score, keyword coverage against a job description, and rewrite suggestions pinned to specific bullet points.
- **AI mock interviews** — role-specific sessions with follow-up questions, then a score on structure, specificity and relevance.
- **Job tracking** — every application in one board with stages, sources and reminders.
- **Analytics and a career plan** — the trend across sessions, where scores stall, and what to work on next.

The point is not the individual features. It is that analysing, practising and applying feed the same profile, so improvement is measurable rather than a feeling.

## The hard part: making AI feedback specific

My first version asked a model to "review this resume". It came back polite and useless — "consider quantifying your achievements" on a resume that already had numbers in it.

The fix was to stop treating the model as an advisor and start treating it as a grader. Every analysis now runs against a fixed rubric with structured output: each finding has to reference a real line, name the failing criterion, and propose a replacement. If it cannot point at something concrete, it does not get shown. That single constraint changed the product more than any model upgrade did.

## Scoring an ATS you cannot see

Real applicant tracking systems are closed boxes, and any tool claiming to replicate one is guessing. So Gradr scores only what is genuinely checkable: whether the document parses cleanly, whether the expected sections exist, how the keywords line up with the target role, and which formatting choices are known to break parsers. Each component is shown separately with its reasoning. An honest 78 with an explanation beats a confident 94 that means nothing.

## Keeping cost predictable

Resumes and interview transcripts are long, and long context is expensive. Requests are trimmed to the relevant sections, repeat analyses are cached, heavy work runs on demand instead of on every edit, and usage is metered against a credit balance. That keeps per-user cost bounded, which matters when the target audience is students.

## Privacy, because these are real documents

A resume is personal data. Everything is scoped per user with row-level security, files sit in access-controlled storage, and no document is reachable from another account. That constraint was designed in at the schema level rather than bolted on later.

## Where it is now

Gradr is in active development, with the six core modules working end to end and an MCP integration that exposes resumes, tracked jobs and reminders to assistants. Next up: sharper interview scoring, deeper job-match signals, and a cleaner weekly summary.

If you want the full breakdown — stack, screens, challenges and results — the [Gradr project page](/projects/gradr) goes into detail.
',
  ARRAY['Gradr','AI','Product','Case Study'],
  true, now(), 6
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
  tags = EXCLUDED.tags, published = true, published_at = COALESCE(public.blog_posts.published_at, now()),
  reading_minutes = EXCLUDED.reading_minutes, updated_at = now();

-- =============================================================
-- 20260905155846_1e295ad2-a8cb-4062-8b92-555fb873dfff.sql
-- =============================================================
-- Inline admin checks in policies so has_role no longer needs to be executable by signed-in users
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR SELECT TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'))
WITH CHECK (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can read the audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can read the audit log" ON public.admin_audit_log FOR SELECT TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can read all posts" ON public.blog_posts;
CREATE POLICY "Admins can read all posts" ON public.blog_posts FOR SELECT TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can create posts" ON public.blog_posts;
CREATE POLICY "Admins can create posts" ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;
CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'))
WITH CHECK (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;
CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE TO authenticated
USING (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- Signed-in users no longer need to execute the SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated, anon, public;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM authenticated, anon, public;

-- =============================================================
-- 20260905190147_cf107ce5-6451-434e-bf40-dfc1e7322495.sql
-- =============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  problem text,
  solution text,
  features text[] NOT NULL DEFAULT '{}',
  process text,
  learned text,
  built text[] NOT NULL DEFAULT '{}',
  tech text[] NOT NULL DEFAULT '{}',
  filters text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Building',
  live text,
  github text,
  demo text,
  previously text,
  platform text,
  stack jsonb,
  challenges jsonb,
  results jsonb,
  gallery jsonb,
  metrics jsonb,
  featured boolean NOT NULL DEFAULT false,
  featured_image text,
  image_alt text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  start_date date,
  end_date date,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published projects"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (published = true AND archived = false);

CREATE POLICY "Admins can read all projects"
  ON public.projects FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can create projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS projects_published_idx ON public.projects (published, archived, sort_order);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  filename text NOT NULL DEFAULT '',
  mime_type text NOT NULL DEFAULT '',
  size_bytes integer NOT NULL DEFAULT 0,
  alt text NOT NULL DEFAULT '',
  caption text,
  title text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media metadata"
  ON public.media_assets FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert media"
  ON public.media_assets FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can update media"
  ON public.media_assets FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can delete media"
  ON public.media_assets FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_image_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'Andrew Mathews',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS og_image text;

-- =============================================================
-- 20260907122704_4664b062-4b11-4f3f-b84f-9193614f17d6.sql
-- =============================================================
CREATE POLICY "Admins can read media files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- =============================================================
-- 20261018120000_lockdown_public_signup.sql
-- =============================================================
-- Lock down public signups at the database level.
--
-- The first account registration is still allowed (no admin exists yet) so the
-- initial admin can sign up via /auth and be granted the admin role by the
-- bootstrap_first_admin trigger. Once an admin exists, every subsequent
-- auth.users INSERT is rejected, closing public registration automatically.
--
-- To add another user later: drop this trigger, sign up / invite them, grant
-- the role, then recreate the trigger. Alternatively, disable email signup in
-- the Supabase dashboard (Authentication → Providers → Email).

CREATE OR REPLACE FUNCTION public.block_signup_after_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Public registration is disabled. Only an administrator can add new users.';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.block_signup_after_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_block_signup ON auth.users;
CREATE TRIGGER on_auth_user_created_block_signup
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.block_signup_after_admin();


