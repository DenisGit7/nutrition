-- Nutrition app 1.14: cooked weights are calculated automatically from standard cooking yields.
-- This column marks recipes whose cooked weight you weighed yourself (those are kept as typed).
-- Run once in Supabase → SQL Editor. Safe to run again.
alter table public.recipes add column if not exists cooked_weighed boolean not null default false;
notify pgrst, 'reload schema';
-- Existing cooked weights were AI estimates → from now on the app uses the automatic value instead
-- (and recounts food-log entries logged by cooked grams), until you type a weighed value.
