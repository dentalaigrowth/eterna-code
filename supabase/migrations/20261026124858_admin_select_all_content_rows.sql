/*
# Admin can SELECT all rows on content tables (including unpublished)

1. Problem
   The existing SELECT policy `public_read_*` on every content table
   (products, brands, categories, rooms, designers, articles) uses
   `published = true` and applies to BOTH `anon` and `authenticated`.
   This means a logged-in admin (authenticated) can only see published
   rows — drafts disappear from the admin list, and toggling a row to
   "Draft" makes it vanish from the admin's own screen.

2. Fix
   Add a separate SELECT policy `admin_read_*` scoped `TO authenticated`
   with `USING (true)` so the admin sees every row regardless of
   published status. The existing `public_read_*` policy (published = true,
   TO anon, authenticated) stays in place for the public site.

   PostgreSQL RLS policies are OR-combined: a row is visible if ANY
   permissive SELECT policy passes. For `authenticated` users both
   policies apply, so they see all rows. For `anon` users only
   `public_read_*` applies, so they see only published rows.

3. Tables affected
   - products, brands, categories, rooms, designers, articles

4. Security
   - No changes to INSERT/UPDATE/DELETE policies.
   - No changes to grants (authenticated already has SELECT).
   - The new policy is idempotent (DROP IF EXISTS first).
*/

DO $$
DECLARE
  t text;
  tables text[] := ARRAY['products','brands','categories','rooms','designers','articles'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin_read_%s" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "admin_read_%s" ON %I FOR SELECT TO authenticated USING (true);', t, t);
  END LOOP;
END $$;
