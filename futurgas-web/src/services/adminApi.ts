import { requireSupabase } from '../lib/supabase';
import type {
  MediaItem,
  NavigationItem,
  PageSection,
  ProjectImage,
  ProjectItem,
  ServiceItem,
  SiteSettings,
  SiteSettingsPayload,
  TeamMember,
} from '../types/content';

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function fetchAdminDashboardCounts() {
  const supabase = requireSupabase();
  const [services, projects, media, drafts, team] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('media_library').select('id', { count: 'exact', head: true }),
    supabase
      .from('page_sections')
      .select('id', { count: 'exact', head: true })
      .eq('has_unpublished_changes', true),
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
  ]);

  return {
    services: services.count ?? 0,
    projects: projects.count ?? 0,
    media: media.count ?? 0,
    unpublishedSections: drafts.count ?? 0,
    team: team.count ?? 0,
  };
}

export async function fetchSiteSettingsAdmin(): Promise<SiteSettings | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function saveSiteSettingsDraft(payload: SiteSettingsPayload, id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      draft_payload: payload,
      has_unpublished_changes: true,
      site_name: payload.site_name,
      logo_url: payload.logo_url,
      favicon_url: payload.favicon_url,
      primary_color: payload.primary_color,
      secondary_color: payload.secondary_color,
      contact_email: payload.contact_email,
      phones: payload.phones,
      whatsapp: payload.whatsapp,
      address: payload.address,
      social_links: payload.social_links,
      seo_settings: payload.seo_settings,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function publishSiteSettings(id: string, payload: SiteSettingsPayload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      ...payload,
      draft_payload: payload,
      published_payload: payload,
      has_unpublished_changes: false,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function fetchSectionsAdmin(): Promise<PageSection[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return (data ?? []) as PageSection[];
}

export async function updateSectionDraft(
  id: string,
  draft_content: Record<string, unknown>,
  extras?: Partial<Pick<PageSection, 'title' | 'is_visible' | 'display_order'>>
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('page_sections')
    .update({
      draft_content,
      has_unpublished_changes: true,
      ...extras,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PageSection;
}

export async function publishSection(id: string) {
  const supabase = requireSupabase();
  const { data: current, error: fetchError } = await supabase
    .from('page_sections')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('page_sections')
    .update({
      published_content: current.draft_content,
      has_unpublished_changes: false,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as PageSection;
}

export async function publishAllSections() {
  const sections = await fetchSectionsAdmin();
  for (const section of sections) {
    if (section.has_unpublished_changes) {
      await publishSection(section.id);
    }
  }
}

export async function reorderSections(orderedIds: string[]) {
  const supabase = requireSupabase();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('page_sections').update({ display_order: index + 1 }).eq('id', id)
    )
  );
}

export async function fetchServicesAdmin(): Promise<ServiceItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('services').select('*').order('display_order');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    features: Array.isArray(row.features) ? row.features : [],
  })) as ServiceItem[];
}

export async function upsertService(
  input: Partial<ServiceItem> & { title: string; description: string }
) {
  const supabase = requireSupabase();
  const payload = {
    title: input.title,
    slug: input.slug || slugify(input.title),
    description: input.description,
    features: input.features ?? [],
    image_url: input.image_url ?? null,
    icon_key: input.icon_key ?? 'fire',
    color_from: input.color_from ?? '#f59e0b',
    color_to: input.color_to ?? '#d97706',
    is_visible: input.is_visible ?? true,
    display_order: input.display_order ?? 0,
    has_unpublished_changes: false,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', input.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as ServiceItem;
  }

  const { data, error } = await supabase.from('services').insert(payload).select('*').single();
  if (error) throw error;
  return data as ServiceItem;
}

export async function deleteService(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchProjectsAdmin(): Promise<ProjectItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('projects').select('*').order('display_order');
  if (error) throw error;
  return (data ?? []) as ProjectItem[];
}

export async function upsertProject(
  input: Partial<ProjectItem> & { title: string; description: string }
) {
  const supabase = requireSupabase();
  const payload = {
    title: input.title,
    slug: input.slug || slugify(input.title),
    description: input.description,
    cover_image: input.cover_image ?? null,
    category: input.category ?? null,
    location: input.location ?? null,
    completion_date: input.completion_date ?? null,
    service_slug: input.service_slug ?? null,
    is_published: input.is_published ?? false,
    display_order: input.display_order ?? 0,
    has_unpublished_changes: false,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', input.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as ProjectItem;
  }

  const { data, error } = await supabase.from('projects').insert(payload).select('*').single();
  if (error) throw error;
  return data as ProjectItem;
}

export async function deleteProject(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchProjectImages(projectId: string): Promise<ProjectImage[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order');
  if (error) throw error;
  return (data ?? []) as ProjectImage[];
}

export async function addProjectImage(projectId: string, imageUrl: string, altText?: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: projectId,
      image_url: imageUrl,
      alt_text: altText ?? null,
      display_order: 0,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as ProjectImage;
}

export async function fetchNavigationAdmin(): Promise<NavigationItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return (data ?? []) as NavigationItem[];
}

export async function upsertNavigationItem(input: Partial<NavigationItem> & { label: string; url: string }) {
  const supabase = requireSupabase();
  const payload = {
    label: input.label,
    url: input.url,
    display_order: input.display_order ?? 0,
    is_visible: input.is_visible ?? true,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('navigation_items')
      .update(payload)
      .eq('id', input.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as NavigationItem;
  }

  const { data, error } = await supabase
    .from('navigation_items')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return data as NavigationItem;
}

export async function deleteNavigationItem(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('navigation_items').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchTeamAdmin(): Promise<TeamMember[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return (data ?? []) as TeamMember[];
}

export async function upsertTeamMember(
  input: Partial<TeamMember> & { name: string }
) {
  const supabase = requireSupabase();
  const payload = {
    name: input.name,
    role: input.role ?? null,
    photo_url: input.photo_url ?? null,
    display_order: input.display_order ?? 0,
    is_visible: input.is_visible ?? true,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('team_members')
      .update(payload)
      .eq('id', input.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as TeamMember;
  }

  const { data, error } = await supabase.from('team_members').insert(payload).select('*').single();
  if (error) throw error;
  return data as TeamMember;
}

export async function deleteTeamMember(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchMediaLibrary(): Promise<MediaItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

export async function uploadMediaFile(file: File, altText?: string) {
  const supabase = requireSupabase();
  const ext = file.name.split('.').pop() || 'bin';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from('media').getPublicUrl(path);

  const { data, error } = await supabase
    .from('media_library')
    .insert({
      filename: file.name,
      storage_path: path,
      public_url: publicData.publicUrl,
      alt_text: altText ?? null,
      file_type: file.type,
      file_size: file.size,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as MediaItem;
}

export async function deleteMediaItem(item: MediaItem) {
  const supabase = requireSupabase();
  await supabase.storage.from('media').remove([item.storage_path]);
  const { error } = await supabase.from('media_library').delete().eq('id', item.id);
  if (error) throw error;
}

export async function updateMediaAlt(id: string, alt_text: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('media_library')
    .update({ alt_text })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as MediaItem;
}
