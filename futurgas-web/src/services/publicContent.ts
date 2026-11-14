import { fallbackSiteData } from '../lib/fallbackContent';
import { isSafeHref } from '../lib/safeUrl';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  NavigationItem,
  PublicSiteData,
  SectionType,
  ServiceItem,
  SiteSettingsPayload,
  ProjectItem,
  TeamMember,
} from '../types/content';

export type PublicSiteFetchResult = {
  data: PublicSiteData;
  usingFallback: boolean;
};

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

function fallbackResult(): PublicSiteFetchResult {
  return { data: fallbackSiteData, usingFallback: true };
}

/**
 * Con Supabase configurado, la web muestra SOLO lo que está en la base
 * (editable desde /gestion). El contenido demo local solo se usa si no hay
 * conexión o falla el fetch principal.
 */
export async function fetchPublicSiteData(): Promise<PublicSiteFetchResult> {
  if (!isSupabaseConfigured) {
    return fallbackResult();
  }

  const supabase = getSupabase();
  if (!supabase) return fallbackResult();

  try {
    const [settingsRes, navRes, sectionsRes, servicesRes, projectsRes, teamRes] =
      await Promise.all([
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
      return fallbackResult();
    }

    if (teamRes.error) {
      console.warn('Supabase team fetch error (showing empty team)', teamRes.error);
    }

    const settings = mapSettings(settingsRes.data as Record<string, unknown> | null);

    const navigation = (navRes.data ?? [])
      .map((item) => ({
        id: item.id as string,
        label: item.label as string,
        url: item.url as string,
        display_order: item.display_order as number,
        is_visible: true,
      }))
      .filter((item) => isSafeHref(item.url) && item.url !== '#obras')
      .sort((a, b) => a.display_order - b.display_order) as NavigationItem[];

    const sections = (sectionsRes.data ?? [])
      .map((item) => ({
        id: item.id as string,
        section_type: item.section_type as SectionType,
        title: (item.title as string | null) ?? null,
        content: (item.content as Record<string, unknown>) ?? {},
        display_order: item.display_order as number,
      }))
      .filter((item) => item.section_type !== 'projects')
      .sort((a, b) => a.display_order - b.display_order);

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
      const { data: imagesData, error: imagesError } = await supabase
        .from('v_public_project_images')
        .select('id, project_id, image_url, alt_text, display_order')
        .in('project_id', ids)
        .order('display_order');

      if (imagesError) {
        console.warn('Supabase project images fetch error', imagesError);
      } else if (imagesData?.length) {
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

    return {
      usingFallback: false,
      data: {
        settings,
        navigation,
        sections,
        services,
        projects,
        team,
        media: [],
      },
    };
  } catch (error) {
    console.warn('fetchPublicSiteData failed', error);
    return fallbackResult();
  }
}
