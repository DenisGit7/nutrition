-- =====================================================================
--  Nutrition app — update 1.3.0: product pictures
--  Paste into Supabase → SQL Editor → New query → Run.  Safe to run again.
-- =====================================================================

-- picture of the product (link to the photo)
alter table public.products add column if not exists image text;

-- file storage for product photos: folder per household, readable by link
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- only members of a household can add / change / delete photos in its folder
drop policy if exists "product images read"   on storage.objects;
drop policy if exists "product images add"    on storage.objects;
drop policy if exists "product images change" on storage.objects;
drop policy if exists "product images delete" on storage.objects;

create policy "product images read" on storage.objects for select to authenticated
  using (bucket_id = 'product-images');
create policy "product images add" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_member(((storage.foldername(name))[1])::uuid));
create policy "product images change" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_member(((storage.foldername(name))[1])::uuid));
create policy "product images delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_member(((storage.foldername(name))[1])::uuid));
