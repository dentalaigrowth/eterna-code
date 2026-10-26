/*
# ETERNA admin content tables

Creates the storage layer for the ETERNA website's bilingual content management.
The public site reads all content from these tables at load time and falls back
to the static data.js / data-designers.js data if the fetch fails or tables are empty.
The admin panel (signed-in users) can edit everything.

## 1. New tables

Each content table stores the full object exactly in the current window.ETERNA shape
(its {en, sq} text fields) inside a `data` jsonb column, keyed by its existing string id.

- `brands`            (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)
- `categories`        (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)
- `rooms`             (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)
- `products`          (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)
- `designers`         (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)
- `articles`          (id text PK, data jsonb, published bool default true, sort_order int default 0, updated_at timestamptz)

Page-level content (free-form blocks, e.g. hero text overrides) lives in:

- `site_content`      (key text PK, value jsonb) — fully readable, admin-only writes

Editable UI copy (the strings that currently live in the T object inside app.js)
lives in:

- `ui_strings`        (key text PK, value jsonb {en, sq}) — fully readable, admin-only writes

`updated_at` is auto-maintained by the shared `touch_updated_at()` trigger function.

## 2. Security

RLS is enabled on every table.

- Public read: anyone (anon + authenticated) can SELECT rows where `published = true`
  on the content tables; `site_content` and `ui_strings` are fully readable by everyone.
- Admin write: only authenticated users can INSERT / UPDATE / DELETE. There is no
  service-role key in frontend code; all admin actions go through the authenticated
  Supabase client after login.

Grants: anon + authenticated get SELECT on all tables; authenticated gets the three
write verbs on every table.

## 3. updated_at trigger

A shared trigger function `touch_updated_at()` returns NEW.updated_at = now() and is
attached BEFORE UPDATE on each content table.
*/

-- shared trigger function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- content tables (one shape)
CREATE TABLE IF NOT EXISTS public.brands (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.rooms (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.designers (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.articles (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- site_content: editable page texts
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ui_strings: editable T-object strings {en, sq}
CREATE TABLE IF NOT EXISTS public.ui_strings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
DROP TRIGGER IF EXISTS brands_touch_updated_at ON public.brands;
CREATE TRIGGER brands_touch_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS categories_touch_updated_at ON public.categories;
CREATE TRIGGER categories_touch_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS rooms_touch_updated_at ON public.rooms;
CREATE TRIGGER rooms_touch_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS products_touch_updated_at ON public.products;
CREATE TRIGGER products_touch_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS designers_touch_updated_at ON public.designers;
CREATE TRIGGER designers_touch_updated_at BEFORE UPDATE ON public.designers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS articles_touch_updated_at ON public.articles;
CREATE TRIGGER articles_touch_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS site_content_touch_updated_at ON public.site_content;
CREATE TRIGGER site_content_touch_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS ui_strings_touch_updated_at ON public.ui_strings;
CREATE TRIGGER ui_strings_touch_updated_at BEFORE UPDATE ON public.ui_strings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_strings ENABLE ROW LEVEL SECURITY;

-- grants
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.designers TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT SELECT ON public.ui_strings TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.designers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ui_strings TO authenticated;

-- policies: content tables — public read of published rows
DROP POLICY IF EXISTS "public_read_brands" ON public.brands;
CREATE POLICY "public_read_brands" ON public.brands FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "public_read_rooms" ON public.rooms;
CREATE POLICY "public_read_rooms" ON public.rooms FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "public_read_designers" ON public.designers;
CREATE POLICY "public_read_design_designers" ON public.designers;
CREATE POLICY "public_read_designers" ON public.designers FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "public_read_articles" ON public.articles;
CREATE POLICY "public_read_articles" ON public.articles FOR SELECT
  TO anon, authenticated USING (published = true);

-- admin write (any signed-in user)
DROP POLICY IF EXISTS "admin_insert_brands" ON public.brands;
CREATE POLICY "admin_insert_brands" ON public.brands FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_brands" ON public.brands;
CREATE POLICY "admin_update_brands" ON public.brands FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_brands" ON public.brands;
CREATE POLICY "admin_delete_brands" ON public.brands FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON public.categories;
CREATE POLICY "admin_insert_categories" ON public.categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_categories" ON public.categories;
CREATE POLICY "admin_update_categories" ON public.categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_categories" ON public.categories;
CREATE POLICY "admin_delete_categories" ON public.categories FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_rooms" ON public.rooms;
CREATE POLICY "admin_insert_rooms" ON public.rooms FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_rooms" ON public.rooms;
CREATE POLICY "admin_update_rooms" ON public.rooms FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_rooms" ON public.rooms;
CREATE POLICY "admin_delete_rooms" ON public.rooms FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON public.products;
CREATE POLICY "admin_insert_products" ON public.products FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_products" ON public.products;
CREATE POLICY "admin_update_products" ON public.products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_products" ON public.products;
CREATE POLICY "admin_delete_products" ON public.products FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_designers" ON public.designers;
CREATE POLICY "admin_insert_designers" ON public.designers FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_designers" ON public.designers;
CREATE POLICY "admin_update_designers" ON public.designers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_designers" ON public.designers;
CREATE POLICY "admin_delete_designers" ON public.designers FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_articles" ON public.articles;
CREATE POLICY "admin_insert_articles" ON public.articles FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_articles" ON public.articles;
CREATE POLICY "admin_update_articles" ON public.articles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_articles" ON public.articles;
CREATE POLICY "admin_delete_articles" ON public.articles FOR DELETE
  TO authenticated USING (true);

-- site_content: fully readable, admin writes
DROP POLICY IF EXISTS "public_read_site_content" ON public.site_content;
CREATE POLICY "public_read_site_content" ON public.site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_content" ON public.site_content;
CREATE POLICY "admin_insert_site_content" ON public.site_content FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_site_content" ON public.site_content;
CREATE POLICY "admin_update_site_content" ON public.site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_site_content" ON public.site_content;
CREATE POLICY "admin_delete_site_content" ON public.site_content FOR DELETE
  TO authenticated USING (true);

-- ui_strings: fully readable, admin writes
DROP POLICY IF EXISTS "public_read_ui_strings" ON public.ui_strings;
CREATE POLICY "public_read_ui_strings" ON public.ui_strings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_ui_strings" ON public.ui_strings;
CREATE POLICY "admin_insert_ui_strings" ON public.ui_strings FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_ui_strings" ON public.ui_strings;
CREATE POLICY "admin_update_ui_strings" ON public.ui_strings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_ui_strings" ON public.ui_strings;
CREATE POLICY "admin_delete_ui_strings" ON public.ui_strings FOR DELETE
  TO authenticated USING (true);
