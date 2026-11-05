-- Relaciona obras/trabajos con un servicio (patrón Seprogar: trabajos → especialidad).

alter table public.projects
  add column if not exists service_slug text;

create index if not exists projects_service_slug_idx
  on public.projects (service_slug);

-- CREATE OR REPLACE no puede insertar columnas en el medio de una vista existente.
drop view if exists public.v_public_projects;

create view public.v_public_projects
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
  service_slug,
  display_order,
  updated_at
from public.projects
where is_published = true;

grant select on public.v_public_projects to anon, authenticated;

-- Lectura pública de imágenes de obras publicadas
drop policy if exists project_images_public_read on public.project_images;
create policy project_images_public_read
  on public.project_images for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.is_published = true
    )
  );
