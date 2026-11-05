-- Amplía los section_type permitidos (process, coverage, team, faq).
-- Necesario si 001_schema ya se ejecutó con el check viejo.

alter table public.page_sections
  drop constraint if exists page_sections_section_type_check;

alter table public.page_sections
  add constraint page_sections_section_type_check
  check (section_type in (
    'hero', 'about', 'services', 'projects', 'gallery',
    'process', 'coverage', 'team', 'faq', 'contact', 'custom'
  ));
