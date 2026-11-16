-- Nutrition app 1.13: category of shopping-list items (for "sort by category")
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.shopping_items add column if not exists category text;  -- veg | fruit | dairy | meat | bakery | grains | pantry | frozen | snacks | drinks | home | other
notify pgrst, 'reload schema';
-- Existing items get a category automatically (by name, or by the AI) the next time the app opens.
