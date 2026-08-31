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