-- ============================================================
-- Siap CPNS — Supabase schema
-- Paste into Supabase Studio > SQL Editor and run (whole file).
-- ============================================================

-- ---------- Reference data ----------
create table if not exists public.instansi (
  id          text primary key,            -- e.g. "kemenkeu"
  name        text not null,
  parent_id   text references public.instansi(id) on delete set null,
  category    text,                         -- "Kementerian" | "Pemda" | "Lembaga" | ...
  created_at  timestamptz not null default now()
);

create table if not exists public.jabatan (
  id          text primary key,            -- e.g. "analis-ahli-pertama"
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.provinsi (
  id          text primary key,            -- e.g. "jabar"
  name        text not null
);

-- ---------- Content ----------
create table if not exists public.lessons (
  id          text primary key,            -- e.g. "twk-pancasila"
  sub         text not null check (sub in ('TWK','TIU','TKP')),
  title       text not null,
  minutes     int  not null default 3,
  body        text not null,               -- HTML
  ingat       text not null,
  ord         int  not null default 0
);

create table if not exists public.questions (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null check (topic in ('TWK','TIU','TKP')),
  type        text not null check (type in ('mcq','tkp')),
  q           text not null,
  why         text not null default '',
  correct     int,                          -- index for mcq, null for tkp
  ord         int  not null default 0
);

create table if not exists public.question_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  idx         int  not null,                -- 0..3
  text        text not null,
  points      int,                          -- 1..5 for tkp, null for mcq
  unique (question_id, idx)
);

-- ---------- Profiles (1:1 with auth.users) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  instansi_id text references public.instansi(id) on delete set null,
  jabatan_id  text references public.jabatan(id) on delete set null,
  provinsi_id text references public.provinsi(id) on delete set null,
  photo_url   text,
  is_pro      boolean not null default true,  -- prototype: everyone Pro
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Attempts (tryout results) ----------
create table if not exists public.attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  twk_score   int not null,                 -- 0..100
  tiu_score   int not null,
  tkp_score   int not null,
  total       int not null,                 -- twk+tiu+tkp (0..300)
  pts         int not null default 0,       -- XP earned
  lulus       boolean not null default false,
  weak        text,
  created_at  timestamptz not null default now()
);

create table if not exists public.answers (
  id          uuid primary key default gen_random_uuid(),
  attempt_id  uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  choice      int                            -- selected option index, null if skipped
);

-- ---------- Progress (learning path) ----------
create table if not exists public.lesson_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   text not null references public.lessons(id) on delete cascade,
  done_at     timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.node_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  node_id     text not null,                 -- "Q-TWK", "C-TIU", ...
  done_at     timestamptz not null default now(),
  primary key (user_id, node_id)
);

create table if not exists public.streak_days (
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null,
  primary key (user_id, day)
);

create table if not exists public.question_reports (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  question_id uuid references public.questions(id) on delete cascade,
  reason      text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Leaderboard view: best total per user + profile dims
-- ============================================================
create or replace view public.leaderboard as
select
  p.id            as user_id,
  p.name,
  p.photo_url,
  p.instansi_id,
  p.jabatan_id,
  p.provinsi_id,
  b.best_total,
  b.best_twk,
  b.best_tiu,
  b.best_tkp
from public.profiles p
join lateral (
  select total as best_total, twk_score as best_twk, tiu_score as best_tiu, tkp_score as best_tkp
  from public.attempts a
  where a.user_id = p.id
  order by total desc, created_at asc
  limit 1
) b on true;

-- ============================================================
-- Auto-create a profile row when a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.attempts        enable row level security;
alter table public.answers         enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.node_progress   enable row level security;
alter table public.streak_days     enable row level security;
alter table public.question_reports enable row level security;
alter table public.instansi        enable row level security;
alter table public.jabatan         enable row level security;
alter table public.provinsi        enable row level security;
alter table public.lessons         enable row level security;
alter table public.questions       enable row level security;
alter table public.question_options enable row level security;

-- Reference + content: readable by everyone (incl. anon)
do $$
declare t text;
begin
  foreach t in array array['instansi','jabatan','provinsi','lessons','questions','question_options']
  loop
    execute format('drop policy if exists "read_all_%1$s" on public.%1$s;', t);
    execute format('create policy "read_all_%1$s" on public.%1$s for select using (true);', t);
  end loop;
end $$;

-- Profiles: anyone can read (needed for leaderboard names); only owner writes own row
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select using (true);
drop policy if exists "profiles_upsert" on public.profiles;
create policy "profiles_upsert" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Attempts: owner full access; others may read (for leaderboard aggregation)
drop policy if exists "attempts_read" on public.attempts;
create policy "attempts_read" on public.attempts for select using (true);
drop policy if exists "attempts_write" on public.attempts;
create policy "attempts_write" on public.attempts for insert with check (auth.uid() = user_id);

-- Owner-only tables
do $$
declare t text;
begin
  foreach t in array array['answers','lesson_progress','node_progress','streak_days']
  loop
    -- answers is scoped via attempt ownership; handle separately below
    null;
  end loop;
end $$;

drop policy if exists "lp_all" on public.lesson_progress;
create policy "lp_all" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "np_all" on public.node_progress;
create policy "np_all" on public.node_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "sd_all" on public.streak_days;
create policy "sd_all" on public.streak_days for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- answers: tied to an attempt the user owns
drop policy if exists "answers_rw" on public.answers;
create policy "answers_rw" on public.answers for all
  using (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()))
  with check (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- reports: user creates own, reads own
drop policy if exists "qr_insert" on public.question_reports;
create policy "qr_insert" on public.question_reports for insert with check (auth.uid() = user_id);
drop policy if exists "qr_read" on public.question_reports;
create policy "qr_read" on public.question_reports for select using (auth.uid() = user_id);
