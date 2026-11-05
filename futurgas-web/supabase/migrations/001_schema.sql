-- Futurgas CMS schema
-- Ejecutar en el SQL Editor de Supabase (o vía CLI) antes del seed.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_users (debe existir antes de is_admin)
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null default 'admin'
    check (role in ('admin', 'editor')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_users_user_id_idx on public.admin_users (user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- site_settings (single-row conceptual)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Futurgas',
  logo_url text,
  favicon_url text,
  primary_color text not null default '#3b82f6',
  secondary_color text not null default '#0f172a',
  contact_email text,
  phones jsonb not null default '[]'::jsonb,
  whatsapp text,
  address text,
  social_links jsonb not null default '{}'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  draft_payload jsonb,
  published_payload jsonb,
  has_unpublished_changes boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pages_slug_idx on public.pages (slug);
create index if not exists pages_published_idx on public.pages (is_published);

create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- page_sections
-- ---------------------------------------------------------------------------

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  section_type text not null
    check (section_type in (
      'hero', 'about', 'services', 'projects', 'gallery',
      'process', 'coverage', 'team', 'faq', 'contact', 'custom'
    )),
  title text,
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  has_unpublished_changes boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists page_sections_page_order_idx
  on public.page_sections (page_id, display_order);
create index if not exists page_sections_type_idx
  on public.page_sections (section_type);

create trigger page_sections_set_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  image_url text,
  icon_key text not null default 'fire',
  color_from text not null default '#f59e0b',
  color_to text not null default '#d97706',
  is_visible boolean not null default true,
  display_order integer not null default 0,
  draft_payload jsonb,
  published_payload jsonb,
  has_unpublished_changes boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists services_order_idx on public.services (display_order);
create index if not exists services_visible_idx on public.services (is_visible);

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_image text,
  category text,
  location text,
  completion_date date,
  is_published boolean not null default false,
  display_order integer not null default 0,
  draft_payload jsonb,
  published_payload jsonb,
  has_unpublished_changes boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_order_idx on public.projects (display_order);
create index if not exists projects_published_idx on public.projects (is_published);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- project_images
-- ---------------------------------------------------------------------------

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_images_project_order_idx
  on public.project_images (project_id, display_order);

-- ---------------------------------------------------------------------------
-- media_library
-- ---------------------------------------------------------------------------

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null unique,
  public_url text not null,
  alt_text text,
  file_type text,
  file_size integer,
  checksum text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists media_library_checksum_idx on public.media_library (checksum);
create index if not exists media_library_created_idx on public.media_library (created_at desc);

-- ---------------------------------------------------------------------------
-- navigation_items
-- ---------------------------------------------------------------------------

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists navigation_items_order_idx
  on public.navigation_items (display_order);

create trigger navigation_items_set_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Public read views (sin borradores)
-- ---------------------------------------------------------------------------

-- Vistas públicas con security_invoker=false: solo columnas publicadas.
-- Así anon no puede leer draft_content aunque consulte la vista.

create or replace view public.v_public_site_settings
with (security_invoker = false)
as
select
  id,
  site_name,
  logo_url,
  favicon_url,
  primary_color,
  secondary_color,
  contact_email,
  phones,
  whatsapp,
  address,
  social_links,
  seo_settings,
  coalesce(published_payload, jsonb_build_object(
    'site_name', site_name,
    'logo_url', logo_url,
    'favicon_url', favicon_url,
    'primary_color', primary_color,
    'secondary_color', secondary_color,
    'contact_email', contact_email,
    'phones', phones,
    'whatsapp', whatsapp,
    'address', address,
    'social_links', social_links,
    'seo_settings', seo_settings
  )) as payload,
  updated_at
from public.site_settings;

create or replace view public.v_public_page_sections
with (security_invoker = false)
as
select
  ps.id,
  ps.page_id,
  p.slug as page_slug,
  ps.section_type,
  ps.title,
  ps.published_content as content,
  ps.display_order,
  ps.is_visible,
  ps.updated_at
from public.page_sections ps
join public.pages p on p.id = ps.page_id
where p.is_published = true
  and ps.is_visible = true;

create or replace view public.v_public_services
with (security_invoker = false)
as
select
  id,
  title,
  slug,
  description,
  features,
  image_url,
  icon_key,
  color_from,
  color_to,
  display_order,
  updated_at
from public.services
where is_visible = true;

create or replace view public.v_public_projects
with (security_invoker = false)
as
select
  id,
  title,
  slug,
  description,
  cover_image,
  category,
  location,
  completion_date,
  display_order,
  updated_at
from public.projects
where is_published = true;

create or replace view public.v_public_navigation
with (security_invoker = false)
as
select
  id,
  label,
  url,
  display_order
from public.navigation_items
where is_visible = true;

grant select on public.v_public_site_settings to anon, authenticated;
grant select on public.v_public_page_sections to anon, authenticated;
grant select on public.v_public_services to anon, authenticated;
grant select on public.v_public_projects to anon, authenticated;
grant select on public.v_public_navigation to anon, authenticated;
