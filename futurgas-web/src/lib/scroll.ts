/** Scroll suave a una sección por id / hash. `#inicio` siempre va al tope. */
export function scrollToSection(hashOrId: string) {
  const id = hashOrId.replace(/^#/, '').trim();
  if (!id || id === 'inicio') {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Extrae el hash de un href (`#contacto`, `/#contacto`). */
export function hashFromHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const i = href.indexOf('#');
  if (i === -1) return null;
  const hash = href.slice(i);
  return hash.length > 1 ? hash : null;
}
