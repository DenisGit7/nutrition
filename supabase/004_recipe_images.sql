-- =====================================================================
--  Nutrition app — update 1.5.0: recipe pictures
--  Paste into Supabase → SQL Editor → New query → Run.  Safe to run again.
--  (Needs 003_product_images.sql first — it creates the photo storage.)
-- =====================================================================

-- picture of the dish (link to the photo). Photos are stored in the same
-- 'product-images' storage, in <household>/recipes/<recipe>.jpg
alter table public.recipes add column if not exists image text;

-- make the new column visible to the app right away
notify pgrst, 'reload schema';
