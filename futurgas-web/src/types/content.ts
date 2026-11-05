export type PhoneItem = {
  label: string;
  number: string;
  tel: string;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  [key: string]: string | undefined;
};

export type SeoSettings = {
  title?: string;
  description?: string;
  keywords?: string;
  og_image?: string;
  canonical?: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow?: string;
  headline: string;
  highlight?: string;
  subheadline: string;
  primary_cta: CtaLink;
  secondary_cta?: CtaLink;
  image_url?: string;
  image_alt?: string;
  badges?: { label: string }[];
  stats?: { value: string; label: string }[];
};

export type AboutContent = {
  eyebrow?: string;
  headline: string;
  body: string;
  image_url?: string;
  image_alt?: string;
  highlights?: { title: string; description: string }[];
  cta?: CtaLink;
};

export type ServicesSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  cta?: CtaLink;
};

export type ProjectsSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  empty_message?: string;
};

export type GallerySectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image_ids?: string[];
  empty_message?: string;
};

export type ProcessSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  steps: { title: string; description: string; icon_key?: string }[];
};

export type CoverageSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  zones: string[];
  cta?: CtaLink;
  note?: string;
};

export type FaqSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  items: { question: string; answer: string }[];
  cta_title?: string;
  cta_body?: string;
  cta?: CtaLink;
};

export type TeamSectionContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
};

export type ContactContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  whatsapp_placeholder?: string;
  whatsapp_default_message?: string;
  whatsapp_button_label?: string;
  hours_note?: string;
};

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'projects'
  | 'gallery'
  | 'process'
  | 'coverage'
  | 'team'
  | 'faq'
  | 'contact'
  | 'custom';

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  display_order: number;
  is_visible: boolean;
  is_demo?: boolean;
};

export type SiteSettingsPayload = {
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  contact_email: string | null;
  phones: PhoneItem[];
  whatsapp: string | null;
  address: string | null;
  social_links: SocialLinks;
  seo_settings: SeoSettings;
};

export type SiteSettings = SiteSettingsPayload & {
  id: string;
  draft_payload: SiteSettingsPayload | null;
  published_payload: SiteSettingsPayload | null;
  has_unpublished_changes: boolean;
  updated_at: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  url: string;
  display_order: number;
  is_visible: boolean;
};

export type PageRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  page_id: string;
  section_type: SectionType;
  title: string | null;
  draft_content: Record<string, unknown>;
  published_content: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  has_unpublished_changes: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  image_url: string | null;
  icon_key: string;
  color_from: string;
  color_to: string;
  is_visible: boolean;
  display_order: number;
  has_unpublished_changes: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  category: string | null;
  location: string | null;
  completion_date: string | null;
  is_published: boolean;
  display_order: number;
  has_unpublished_changes: boolean;
  created_at: string;
  updated_at: string;
  /** Relación con el servicio (como trabajos → especialidad en Seprogar). */
  service_slug?: string | null;
  /** Galería asociada a la obra (portada + extras). */
  images?: ProjectImage[];
  /** Marca contenido de demostración en local. */
  is_demo?: boolean;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
};

export type MediaItem = {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  file_type: string | null;
  file_size: number | null;
  checksum: string | null;
  created_at: string;
};

export type PublicSiteData = {
  settings: SiteSettingsPayload;
  navigation: NavigationItem[];
  sections: Array<{
    id: string;
    section_type: SectionType;
    title: string | null;
    content: Record<string, unknown>;
    display_order: number;
  }>;
  services: ServiceItem[];
  projects: ProjectItem[];
  team: TeamMember[];
  media: MediaItem[];
};
