-- Nutrition app 1.12: your own meals (e.g. "Snack 2", "Pre-workout") shown every day, synced between your devices
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.settings add column if not exists meals jsonb not null default '[]'::jsonb;
notify pgrst, 'reload schema';
