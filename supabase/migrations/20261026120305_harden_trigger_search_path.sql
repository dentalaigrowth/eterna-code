/*
# Harden trigger function search_path

Pins the public.touch_updated_at() trigger function's search_path to public,
clearing the function_search_path_mutable advisor warning.
*/

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
