/** URLs seguras para menú / CTAs (bloquea javascript:, data:, etc.). */
export function isSafeHref(url: string): boolean {
  const value = url.trim();
  if (!value) return false;
  if (value.startsWith('#') || value.startsWith('/')) return true;

  try {
    const parsed = new URL(value);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function safeHref(url: string, fallback = '#'): string {
  return isSafeHref(url) ? url.trim() : fallback;
}

export function assertSafeHref(url: string): string {
  const value = url.trim();
  if (!isSafeHref(value)) {
    throw new Error(
      'URL no permitida. Usá anclas (#seccion), rutas (/ruta) o enlaces http(s)/mailto/tel.'
    );
  }
  return value;
}
