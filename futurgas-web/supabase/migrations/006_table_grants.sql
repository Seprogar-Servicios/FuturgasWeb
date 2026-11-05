-- Privilegios de tabla para el rol authenticated (RLS no alcanza sin GRANT).
-- Sin esto, PostgREST responde 403 aunque las policies existan.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.pages to authenticated;
grant select, insert, update, delete on public.page_sections to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_images to authenticated;
grant select, insert, update, delete on public.media_library to authenticated;
grant select, insert, update, delete on public.navigation_items to authenticated;
grant select, insert, update, delete on public.team_members to authenticated;

-- Lectura pública de media vía tabla (además de la vista/storage)
grant select on public.media_library to anon;
