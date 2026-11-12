-- Endurecimiento de seguridad (roles, storage, vistas públicas, media).
-- Ejecutar después de 001–006.

-- ---------------------------------------------------------------------------
-- Roles: solo role=admin gestiona admin_users
-- ---------------------------------------------------------------------------

create or replace function public.is_super_admin()
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
      and au.role = 'admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated, anon;

drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid() or public.is_super_admin());

drop policy if exists admin_users_manage_admin on public.admin_users;
create policy admin_users_manage_admin
  on public.admin_users for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Storage: sin SVG en bucket público
-- ---------------------------------------------------------------------------

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif'
]
where id = 'media';

-- ---------------------------------------------------------------------------
-- project_images: vista pública (no tabla base)
-- ---------------------------------------------------------------------------

drop policy if exists project_images_public_read on public.project_images;

create or replace view public.v_public_project_images
with (security_invoker = false)
as
select
  pi.id,
  pi.project_id,
  pi.image_url,
  pi.alt_text,
  pi.display_order
from public.project_images pi
inner join public.projects p on p.id = pi.project_id
where p.is_published = true;

grant select on public.v_public_project_images to anon, authenticated;

-- ---------------------------------------------------------------------------
-- media_library: sin lectura pública de metadatos
-- (las URLs públicas siguen sirviéndose por el bucket)
-- ---------------------------------------------------------------------------

drop policy if exists media_public_read on public.media_library;

drop policy if exists media_admin_read on public.media_library;
create policy media_admin_read
  on public.media_library for select
  to authenticated
  using (public.is_admin());

revoke select on public.media_library from anon;
