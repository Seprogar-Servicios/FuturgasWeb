-- Equipo público (patrón Seprogar: personas con foto + cargo)

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists team_members_order_idx
  on public.team_members (display_order);

create index if not exists team_members_visible_idx
  on public.team_members (is_visible);

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

create or replace view public.v_public_team_members
with (security_invoker = false)
as
select
  id,
  name,
  role,
  photo_url,
  display_order,
  updated_at
from public.team_members
where is_visible = true;

grant select on public.v_public_team_members to anon, authenticated;

alter table public.team_members enable row level security;

drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read
  on public.team_members for select
  to anon, authenticated
  using (is_visible = true);

drop policy if exists team_members_admin_read on public.team_members;
create policy team_members_admin_read
  on public.team_members for select
  to authenticated
  using (public.is_admin());

drop policy if exists team_members_admin_write on public.team_members;
create policy team_members_admin_write
  on public.team_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
