-- GrowMoney: Initial schema
-- Phase 3: Supabase user data + rankings

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Users table (keyed by toss_user_id)
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  toss_user_id  text unique not null,
  nickname      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Daily selections
create table if not exists public.daily_selections (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  date          date not null,           -- KST date (YYYY-MM-DD)
  asset_id      text not null,
  result_rate   numeric(8, 4),           -- null until resolved
  resolved      boolean not null default false,
  resolved_at   timestamptz,
  created_at    timestamptz not null default now(),
  unique(user_id, date)
);

-- Game snapshots (virtual asset over time)
create table if not exists public.game_snapshots (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  date            date not null,
  virtual_asset   bigint not null,        -- KRW amount
  streak          int not null default 0,
  created_at      timestamptz not null default now(),
  unique(user_id, date)
);

-- Index for rankings query (top N% by virtual_asset)
create index if not exists idx_game_snapshots_asset
  on public.game_snapshots(virtual_asset desc);

create index if not exists idx_daily_selections_user_date
  on public.daily_selections(user_id, date desc);

-- RLS policies
alter table public.users enable row level security;
alter table public.daily_selections enable row level security;
alter table public.game_snapshots enable row level security;

-- Users: each user can only see their own row
create policy "users: select own" on public.users
  for select using (auth.uid()::text = toss_user_id or auth.role() = 'service_role');

create policy "users: insert own" on public.users
  for insert with check (auth.uid()::text = toss_user_id or auth.role() = 'service_role');

create policy "users: update own" on public.users
  for update using (auth.uid()::text = toss_user_id);

-- Selections: own data only
create policy "selections: select own" on public.daily_selections
  for select using (
    user_id in (select id from public.users where toss_user_id = auth.uid()::text)
    or auth.role() = 'service_role'
  );

create policy "selections: insert own" on public.daily_selections
  for insert with check (
    user_id in (select id from public.users where toss_user_id = auth.uid()::text)
    or auth.role() = 'service_role'
  );

-- Snapshots: own data only (rankings read via service_role)
create policy "snapshots: select own" on public.game_snapshots
  for select using (
    user_id in (select id from public.users where toss_user_id = auth.uid()::text)
    or auth.role() = 'service_role'
  );

create policy "snapshots: insert own" on public.game_snapshots
  for insert with check (
    user_id in (select id from public.users where toss_user_id = auth.uid()::text)
    or auth.role() = 'service_role'
  );

create policy "snapshots: update own" on public.game_snapshots
  for update using (
    user_id in (select id from public.users where toss_user_id = auth.uid()::text)
    or auth.role() = 'service_role'
  );

-- Helper: get user's rank percentile
create or replace function public.get_user_rank_percent(p_user_id uuid)
returns int
language sql stable
as $$
  with ranked as (
    select
      user_id,
      virtual_asset,
      rank() over (order by virtual_asset desc) as r,
      count(*) over () as total
    from (
      select distinct on (user_id) user_id, virtual_asset
      from public.game_snapshots
      order by user_id, date desc
    ) latest
  )
  select greatest(1, least(99, round((r::numeric / total) * 100)::int))
  from ranked
  where user_id = p_user_id;
$$;
