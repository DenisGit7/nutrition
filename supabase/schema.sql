-- =====================================================================
--  Nutrition app — Supabase schema
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run more than once.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- tables ----------------------------------------------------

-- A household = a group of people who share recipes and a shopping list
create table if not exists public.households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Home',
  invite_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  created_by  uuid references auth.users(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now()
);

create table if not exists public.members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  display_name text,
  joined_at    timestamptz not null default now(),
  primary key (household_id, user_id)
);

-- Shared with the household
create table if not exists public.recipes (
  id               uuid primary key default gen_random_uuid(),
  household_id     uuid not null references public.households(id) on delete cascade,
  name             text not null,
  servings         numeric not null default 1,
  time_min         numeric,
  ingredients      jsonb not null default '[]'::jsonb,   -- [{name, amount, kcal}]
  kcal_per_serving numeric,                              -- null = sum(ingredient kcal)/servings
  protein          numeric,                              -- grams per serving
  carbs            numeric,
  fat              numeric,
  steps            jsonb not null default '[]'::jsonb,   -- ["step", ...]
  tags             jsonb not null default '[]'::jsonb,
  notes            text,
  source           text,
  created_by       uuid default auth.uid() references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Shared with the household
create table if not exists public.shopping_items (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name         text not null,
  amount       text,
  done         boolean not null default false,
  recipes      jsonb not null default '[]'::jsonb,       -- recipe names the item came from
  created_by   uuid default auth.uid() references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Private to each person
create table if not exists public.food_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day        date not null,
  name       text not null,
  recipe_id  uuid references public.recipes(id) on delete set null,
  servings   numeric not null default 1,
  kcal       numeric not null default 0,
  protein    numeric not null default 0,
  carbs      numeric not null default 0,
  fat        numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Private to each person
create table if not exists public.settings (
  user_id      uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  goal         numeric not null default 2000,
  household_id uuid references public.households(id) on delete set null,
  updated_at   timestamptz not null default now()
);

create index if not exists recipes_household_idx  on public.recipes(household_id);
create index if not exists shopping_household_idx on public.shopping_items(household_id);
create index if not exists food_log_user_day_idx  on public.food_log(user_id, day);
create index if not exists members_user_idx       on public.members(user_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists recipes_touch on public.recipes;
create trigger recipes_touch before update on public.recipes
  for each row execute function public.touch_updated_at();
drop trigger if exists shopping_touch on public.shopping_items;
create trigger shopping_touch before update on public.shopping_items
  for each row execute function public.touch_updated_at();
drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ---------- membership helper -----------------------------------------

create or replace function public.is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where household_id = h and user_id = auth.uid());
$$;

-- ---------- household actions (called from the app) ------------------

create or replace function public.create_household(p_name text, p_display_name text)
returns public.households
language plpgsql security definer set search_path = public as $$
declare h public.households;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  insert into public.households(name, created_by)
    values (coalesce(nullif(trim(p_name), ''), 'Home'), auth.uid())
    returning * into h;
  insert into public.members(household_id, user_id, display_name)
    values (h.id, auth.uid(), p_display_name);
  insert into public.settings(user_id, household_id) values (auth.uid(), h.id)
    on conflict (user_id) do update set household_id = excluded.household_id;
  return h;
end $$;

create or replace function public.join_household(p_code text, p_display_name text)
returns public.households
language plpgsql security definer set search_path = public as $$
declare h public.households;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into h from public.households where invite_code = upper(trim(p_code));
  if h.id is null then raise exception 'Invite code not found'; end if;
  insert into public.members(household_id, user_id, display_name)
    values (h.id, auth.uid(), p_display_name)
    on conflict (household_id, user_id) do update set display_name = excluded.display_name;
  insert into public.settings(user_id, household_id) values (auth.uid(), h.id)
    on conflict (user_id) do update set household_id = excluded.household_id;
  return h;
end $$;

create or replace function public.new_invite_code(p_household uuid)
returns text
language plpgsql security definer set search_path = public as $$
declare c text;
begin
  if not public.is_member(p_household) then raise exception 'Not a member'; end if;
  c := upper(substr(md5(gen_random_uuid()::text), 1, 6));
  update public.households set invite_code = c where id = p_household;
  return c;
end $$;

grant execute on function public.create_household(text, text) to authenticated;
grant execute on function public.join_household(text, text)   to authenticated;
grant execute on function public.new_invite_code(uuid)        to authenticated;
grant execute on function public.is_member(uuid)              to authenticated;

-- ---------- row level security ----------------------------------------

alter table public.households     enable row level security;
alter table public.members        enable row level security;
alter table public.recipes        enable row level security;
alter table public.shopping_items enable row level security;
alter table public.food_log       enable row level security;
alter table public.settings       enable row level security;

drop policy if exists hh_select on public.households;
create policy hh_select on public.households for select to authenticated using (public.is_member(id));
drop policy if exists hh_update on public.households;
create policy hh_update on public.households for update to authenticated using (public.is_member(id)) with check (public.is_member(id));

drop policy if exists mem_select on public.members;
create policy mem_select on public.members for select to authenticated using (public.is_member(household_id));
drop policy if exists mem_update_self on public.members;
create policy mem_update_self on public.members for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists mem_leave on public.members;
create policy mem_leave on public.members for delete to authenticated using (user_id = auth.uid());

drop policy if exists rec_all on public.recipes;
create policy rec_all on public.recipes for all to authenticated
  using (public.is_member(household_id)) with check (public.is_member(household_id));

drop policy if exists shop_all on public.shopping_items;
create policy shop_all on public.shopping_items for all to authenticated
  using (public.is_member(household_id)) with check (public.is_member(household_id));

drop policy if exists log_own on public.food_log;
create policy log_own on public.food_log for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists set_own on public.settings;
create policy set_own on public.settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- live sync between devices ---------------------------------

do $$
declare t text;
begin
  foreach t in array array['recipes','shopping_items','food_log'] loop
    if not exists (select 1 from pg_publication_tables
                   where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- deletes need the full old row so other devices see which item vanished
alter table public.recipes        replica identity full;
alter table public.shopping_items replica identity full;
alter table public.food_log       replica identity full;

-- ---------- table access for signed-in users (rows still filtered by RLS) ----
grant select, insert, update, delete on
  public.households, public.members, public.recipes,
  public.shopping_items, public.food_log, public.settings
to authenticated;


-- ===== included from 002_products.sql (v1.2.0) =====
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
