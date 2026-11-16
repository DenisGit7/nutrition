-- Nutrition app 1.11: cooked weight of the whole recipe (so logging by grams counts cooked food)
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.recipes add column if not exists cooked_g numeric;  -- grams of the whole finished dish
notify pgrst, 'reload schema';
-- Existing recipes get their cooked weight estimated by the AI automatically the next time the app opens.
