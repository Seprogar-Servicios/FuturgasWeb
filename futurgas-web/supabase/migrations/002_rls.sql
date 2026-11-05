-- Row Level Security
-- Lectura pública de contenido publicado; escritura solo admins.

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.media_library enable row level security;
alter table public.navigation_items enable row level security;

-- admin_users
drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists admin_users_manage_admin on public.admin_users;
create policy admin_users_manage_admin
  on public.admin_users for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Lectura pública solo vía vistas v_public_*.
-- Las tablas base con borradores quedan restringidas a administradores.

drop policy if exists site_settings_public_read on public.site_settings;
drop policy if exists site_settings_admin_read on public.site_settings;
create policy site_settings_admin_read
  on public.site_settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists site_settings_admin_write on public.site_settings;
create policy site_settings_admin_write
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists pages_public_read on public.pages;
drop policy if exists pages_admin_read on public.pages;
create policy pages_admin_read
  on public.pages for select
  to authenticated
  using (public.is_admin());

drop policy if exists pages_admin_write on public.pages;
create policy pages_admin_write
  on public.pages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists page_sections_public_read on public.page_sections;
drop policy if exists page_sections_admin_read on public.page_sections;
create policy page_sections_admin_read
  on public.page_sections for select
  to authenticated
  using (public.is_admin());

drop policy if exists page_sections_admin_write on public.page_sections;
create policy page_sections_admin_write
  on public.page_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- services / projects: columnas de borrador no se usan aún en lectura pública directa;
-- igualmente limitamos tablas base a admin y exponemos vía vistas.
drop policy if exists services_public_read on public.services;
drop policy if exists services_admin_read on public.services;
create policy services_admin_read
  on public.services for select
  to authenticated
  using (public.is_admin());

drop policy if exists services_admin_write on public.services;
create policy services_admin_write
  on public.services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists projects_public_read on public.projects;
drop policy if exists projects_admin_read on public.projects;
create policy projects_admin_read
  on public.projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists projects_admin_write on public.projects;
create policy projects_admin_write
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists project_images_public_read on public.project_images;
drop policy if exists project_images_admin_read on public.project_images;
create policy project_images_admin_read
  on public.project_images for select
  to authenticated
  using (public.is_admin());

drop policy if exists project_images_admin_write on public.project_images;
create policy project_images_admin_write
  on public.project_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- media_library: URLs públicas, lectura abierta; escritura admin
drop policy if exists media_public_read on public.media_library;
create policy media_public_read
  on public.media_library for select
  to anon, authenticated
  using (true);

drop policy if exists media_admin_write on public.media_library;
create policy media_admin_write
  on public.media_library for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists navigation_public_read on public.navigation_items;
drop policy if exists navigation_admin_read on public.navigation_items;
create policy navigation_admin_read
  on public.navigation_items for select
  to authenticated
  using (public.is_admin());

drop policy if exists navigation_admin_write on public.navigation_items;
create policy navigation_admin_write
  on public.navigation_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- También necesitamos policy "all" que incluye select; las de read arriba
-- cubren select explícito. Para INSERT/UPDATE/DELETE usamos las *_admin_write.
-- Nota: policy FOR ALL ya incluye SELECT; dejamos read + write separados por claridad.
