import { fallbackSiteData } from '../lib/fallbackContent';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  MediaItem,
  NavigationItem,
  PublicSiteData,
  SectionType,
  ServiceItem,
  SiteSettingsPayload,
  ProjectItem,
  TeamMember,
} from '../types/content';

function asFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function mapSettings(row: Record<string, unknown> | null): SiteSettingsPayload {
  if (!row) return fallbackSiteData.settings;
  const payload = (row.payload as SiteSettingsPayload | undefined) ?? null;
  if (payload) return { ...fallbackSiteData.settings, ...payload };
  return {
    site_name: String(row.site_name ?? fallbackSiteData.settings.site_name),
    logo_url: (row.logo_url as string | null) ?? null,
    favicon_url: (row.favicon_url as string | null) ?? null,
    primary_color: String(row.primary_color ?? '#3b82f6'),
    secondary_color: String(row.secondary_color ?? '#0f172a'),
    contact_email: (row.contact_email as string | null) ?? null,
    phones: Array.isArray(row.phones) ? (row.phones as SiteSettingsPayload['phones']) : [],
    whatsapp: (row.whatsapp as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    social_links: (row.social_links as SiteSettingsPayload['social_links']) ?? {},
    seo_settings: (row.seo_settings as SiteSettingsPayload['seo_settings']) ?? {},
  };
}

export async function fetchPublicSiteData(): Promise<PublicSiteData> {
  if (!isSupabaseConfigured) {
    return fallbackSiteData;
  }

  const supabase = getSupabase();
  if (!supabase) return fallbackSiteData;

  try {
    const [
      settingsRes,
      navRes,
      sectionsRes,
      servicesRes,
      projectsRes,
      teamRes,
      mediaRes,
    ] = await Promise.all([
      supabase.from('v_public_site_settings').select('*').limit(1).maybeSingle(),
      supabase.from('v_public_navigation').select('*').order('display_order'),
      supabase
        .from('v_public_page_sections')
        .select('*')
        .eq('page_slug', 'inicio')
        .order('display_order'),
      supabase.from('v_public_services').select('*').order('display_order'),
      supabase.from('v_public_projects').select('*').order('display_order'),
      supabase.from('v_public_team_members').select('*').order('display_order'),
      supabase.from('media_library').select('*').order('created_at', { ascending: false }),
    ]);

    if (
      settingsRes.error ||
      navRes.error ||
      sectionsRes.error ||
      servicesRes.error ||
      projectsRes.error
    ) {
      console.warn('Supabase public fetch error, using fallback', {
        settings: settingsRes.error,
        nav: navRes.error,
        sections: sectionsRes.error,
        services: servicesRes.error,
        projects: projectsRes.error,
      });
      return fallbackSiteData;
    }

    const settings = mapSettings(settingsRes.data as Record<string, unknown> | null);

    const navigation = (navRes.data ?? []).map((item) => ({
      id: item.id as string,
      label: item.label as string,
      url: item.url as string,
      display_order: item.display_order as number,
      is_visible: true,
    })) as NavigationItem[];

    const sections = (sectionsRes.data ?? []).map((item) => ({
      id: item.id as string,
      section_type: item.section_type as SectionType,
      title: (item.title as string | null) ?? null,
      content: (item.content as Record<string, unknown>) ?? {},
      display_order: item.display_order as number,
    }));

    const services = (servicesRes.data ?? []).map((item) => ({
      id: item.id as string,
      title: item.title as string,
      slug: item.slug as string,
      description: item.description as string,
      features: asFeatures(item.features),
      image_url: (item.image_url as string | null) ?? null,
      icon_key: (item.icon_key as string) || 'fire',
      color_from: (item.color_from as string) || '#f59e0b',
      color_to: (item.color_to as string) || '#d97706',
      is_visible: true,
      display_order: item.display_order as number,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: (item.updated_at as string) || '',
    })) as ServiceItem[];

    let projects = (projectsRes.data ?? []).map((item) => ({
      id: item.id as string,
      title: item.title as string,
      slug: item.slug as string,
      description: item.description as string,
      cover_image: (item.cover_image as string | null) ?? null,
      category: (item.category as string | null) ?? null,
      location: (item.location as string | null) ?? null,
      completion_date: (item.completion_date as string | null) ?? null,
      service_slug: (item.service_slug as string | null) ?? null,
      is_published: true,
      display_order: item.display_order as number,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: (item.updated_at as string) || '',
      images: [] as ProjectItem['images'],
    })) as ProjectItem[];

    if (projects.length) {
      const ids = projects.map((p) => p.id);
      const { data: imagesData } = await supabase
        .from('project_images')
        .select('*')
        .in('project_id', ids)
        .order('display_order');

      if (imagesData?.length) {
        const byProject = new Map<string, ProjectItem['images']>();
        for (const row of imagesData) {
          const list = byProject.get(row.project_id as string) ?? [];
          list!.push({
            id: row.id as string,
            project_id: row.project_id as string,
            image_url: row.image_url as string,
            alt_text: (row.alt_text as string | null) ?? null,
            display_order: row.display_order as number,
          });
          byProject.set(row.project_id as string, list);
        }
        projects = projects.map((project) => ({
          ...project,
          images: byProject.get(project.id) ?? [],
        }));
      }
    }

    const team = ((teamRes.error ? [] : teamRes.data) ?? []).map((item) => ({
      id: item.id as string,
      name: item.name as string,
      role: (item.role as string | null) ?? null,
      photo_url: (item.photo_url as string | null) ?? null,
      display_order: item.display_order as number,
      is_visible: true,
    })) as TeamMember[];

    const media = ((mediaRes.data ?? []) as MediaItem[]) || [];

    let resolvedSections = (sections.length ? sections : fallbackSiteData.sections).filter(
      (item) => item.section_type !== 'projects'
    );

    const requiredSectionTypes = ['gallery', 'process', 'coverage', 'team', 'faq'] as const;
    for (const type of requiredSectionTypes) {
      if (!resolvedSections.some((item) => item.section_type === type)) {
        const fallbackSection = fallbackSiteData.sections.find(
          (item) => item.section_type === type
        );
        if (fallbackSection) {
          resolvedSections = [...resolvedSections, fallbackSection];
        }
      }
    }
    resolvedSections = [...resolvedSections].sort((a, b) => a.display_order - b.display_order);

    let resolvedNav = (navigation.length ? navigation : fallbackSiteData.navigation).filter(
      (item) => item.url !== '#obras'
    );
    for (const url of ['#galeria', '#equipo'] as const) {
      if (!resolvedNav.some((item) => item.url === url)) {
        const navItem = fallbackSiteData.navigation.find((item) => item.url === url);
        if (navItem) resolvedNav = [...resolvedNav, navItem];
      }
    }
    resolvedNav = [...resolvedNav].sort((a, b) => a.display_order - b.display_order);

    return {
      settings,
      navigation: resolvedNav,
      sections: resolvedSections,
      services: services.length ? services : fallbackSiteData.services,
      // Si todavía no hay obras reales, usamos ejemplos locales para la galería.
      projects: projects.length ? projects : fallbackSiteData.projects,
      team: team.length ? team : fallbackSiteData.team,
      media,
    };
  } catch (error) {
    console.warn('fetchPublicSiteData failed', error);
    return fallbackSiteData;
  }
}
