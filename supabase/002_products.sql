-- =====================================================================
--  Nutrition app — update 1.2.0: products database
--  Paste into Supabase → SQL Editor → New query → Run.  Safe to run again.
-- =====================================================================

-- Products saved by your household (shared with everyone in it).
-- Nutrition values are per 100 g (or per 100 ml for drinks).
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name         text not null,
  brand        text,
  barcode      text,
  category     text,
  unit         text not null default 'g',      -- 'g' or 'ml'
  serving_g    numeric,                         -- grams (or ml) in one piece / serving, e.g. egg = 50
  serving_name text,                            -- e.g. "egg", "slice", "cup"
  kcal         numeric,
  protein      numeric,
  carbs        numeric,
  fat          numeric,
  sugar        numeric,
  fiber        numeric,
  source       text,                            -- manual / ai / openfoodfacts / common
  created_by   uuid default auth.uid() references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists products_household_idx on public.products(household_id);
create index if not exists products_barcode_idx on public.products(household_id, barcode);

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
drop policy if exists prod_all on public.products;
create policy prod_all on public.products for all to authenticated
  using (public.is_member(household_id)) with check (public.is_member(household_id));

grant select, insert, update, delete on public.products to authenticated;

-- live sync between devices
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products') then
    execute 'alter publication supabase_realtime add table public.products';
  end if;
end $$;
alter table public.products replica identity full;
