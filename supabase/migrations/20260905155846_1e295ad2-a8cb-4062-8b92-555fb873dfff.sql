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