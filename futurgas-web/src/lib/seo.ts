import type { SeoSettings, SiteSettingsPayload } from '../types/content';

export function applySeo(settings: SiteSettingsPayload) {
  const seo: SeoSettings = settings.seo_settings ?? {};
  const title =
    seo.title || `${settings.site_name} | Instalaciones de gas para la construcción`;
  const description =
    seo.description ||
    'Instalaciones de gas para obras nuevas, redes de distribución y adecuaciones.';
  const image = seo.og_image || settings.logo_url || '/futurgas.png';

  document.title = title;
  setMeta('name', 'description', description);
  if (seo.keywords) setMeta('name', 'keywords', seo.keywords);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', absoluteUrl(image));
  setMeta('property', 'og:type', 'website');
  if (seo.canonical) setMeta('property', 'og:url', seo.canonical);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', absoluteUrl(image));

  if (settings.favicon_url) {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }
}

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}
