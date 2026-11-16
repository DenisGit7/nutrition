-- Nutrition app 1.10: meals in the food log + the eaten amount (for editing later)
-- Run once in Supabase → SQL Editor. Safe to run again.

alter table public.food_log add column if not exists meal        text;     -- breakfast | lunch | dinner | snack
alter table public.food_log add column if not exists amount      numeric;  -- e.g. 200 (grams) or 1.5 (servings)
alter table public.food_log add column if not exists amount_unit text;     -- g | ml | srv (recipe servings) | a product serving name ("cup")

-- existing entries: put them in a meal by the time they were logged (Israel time)
update public.food_log set meal = case
    when extract(hour from created_at at time zone 'Asia/Jerusalem') < 11 then 'breakfast'
    when extract(hour from created_at at time zone 'Asia/Jerusalem') < 16 then 'lunch'
    when extract(hour from created_at at time zone 'Asia/Jerusalem') < 22 then 'dinner'
    else 'snack' end
  where meal is null;

notify pgrst, 'reload schema';
