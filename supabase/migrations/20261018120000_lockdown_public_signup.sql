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
