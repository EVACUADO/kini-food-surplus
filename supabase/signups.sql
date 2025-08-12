-- Enable Realtime on the public schema
-- Run this in Supabase SQL editor or via CLI

-- Tables for capturing signups
create table if not exists public.customer_signups (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  mobile_number text not null,
  password text, -- NOTE: do not store plaintext in production; use Supabase Auth instead
  location text,
  use_gps boolean not null default false,
  agree_to_terms boolean not null default false,
  profile_picture_url text,
  created_at timestamptz not null default now()
);

create unique index if not exists customer_signups_email_key
  on public.customer_signups (lower(email));

create table if not exists public.merchant_signups (
  id uuid default gen_random_uuid() primary key,
  business_name text not null,
  business_branch text,
  business_location text not null,
  use_gps boolean not null default false,
  phone_number text not null,
  business_email text not null,
  line_of_business text[] not null default '{}',
  -- Document URLs (to be uploaded to Supabase Storage separately)
  dti_sec_url text,
  bir_certificate_url text,
  business_permit_url text,
  government_id_url text,
  sanitary_permit_url text,
  business_logo_url text,
  storefront_photo_url text,
  -- E-wallet and verification
  ewallet_provider text,
  ewallet_number text,
  otp_code text,
  otp_verified boolean not null default false,
  -- Agreements
  agree_to_terms boolean not null default false,
  agree_food_safety boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists merchant_signups_email_idx
  on public.merchant_signups (lower(business_email));

-- Add a readable column and keep it in sync via trigger (generated columns require IMMUTABLE expr)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'merchant_signups' and column_name = 'line_of_business_readable'
  ) then
    alter table public.merchant_signups
      add column line_of_business_readable text;
  end if;
end $$;

-- Allow selecting rows (useful when client calls .insert(...).select())
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'merchant_signups' and policyname = 'Allow anon select'
  ) then
    create policy "Allow anon select" on public.merchant_signups
      for select to anon, authenticated using (true);
  end if;
end $$;

-- Allow selecting rows in customer_signups as well (optional but helpful)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'customer_signups' and policyname = 'Allow anon select'
  ) then
    create policy "Allow anon select" on public.customer_signups
      for select to anon, authenticated using (true);
  end if;
end $$;

create or replace function public.merchant_signups_set_lob_readable()
returns trigger
language plpgsql
as $$
begin
  new.line_of_business_readable := array_to_string(new.line_of_business, ', ');
  return new;
end;
$$;

do $$ begin
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'merchant_signups_lob_readable_trg'
      and n.nspname = 'public'
      and c.relname = 'merchant_signups'
  ) then
    create trigger merchant_signups_lob_readable_trg
    before insert or update of line_of_business on public.merchant_signups
    for each row execute function public.merchant_signups_set_lob_readable();
  end if;
end $$;

-- Realtime publication
-- In new projects, Supabase creates a `supabase_realtime` publication automatically for all tables in `public`.
-- If your project is older or you restricted publications, ensure the tables are added:
-- alter publication supabase_realtime add table public.customer_signups;
-- alter publication supabase_realtime add table public.merchant_signups;

-- Row Level Security and policies (optional for simple public inserts; adjust to your needs)
alter table public.customer_signups enable row level security;
alter table public.merchant_signups enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'customer_signups' and policyname = 'Allow anonymous inserts'
  ) then
    create policy "Allow anonymous inserts" on public.customer_signups
      for insert to anon, authenticated with check (true);
  end if;
end $$;

-- Storage: create a public bucket for signup uploads (id/name: 'signups')
insert into storage.buckets (id, name, public)
values ('signups', 'signups', true)
on conflict (id) do nothing;

-- Storage policies
-- Allow anyone to read objects in the 'signups' bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read signups bucket'
  ) then
    create policy "Public read signups bucket" on storage.objects
      for select to anon, authenticated
      using (bucket_id = 'signups');
  end if;
end $$;

-- Allow anonymous and authenticated users to upload to 'signups' bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow uploads to signups bucket'
  ) then
    create policy "Allow uploads to signups bucket" on storage.objects
      for insert to anon, authenticated
      with check (bucket_id = 'signups');
  end if;
end $$;

-- Allow owners to update/delete their own objects by default is complex without auth; skipping for MVP
-- If needed later, add signed uploads or service role handling for moderation.

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'merchant_signups' and policyname = 'Allow anonymous inserts'
  ) then
    create policy "Allow anonymous inserts" on public.merchant_signups
      for insert to anon, authenticated with check (true);
  end if;
end $$;


