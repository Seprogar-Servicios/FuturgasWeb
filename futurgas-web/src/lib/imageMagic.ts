const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((b, i) => bytes[i] === b);
}

/** Valida MIME declarado + magic bytes (evita SVG/HTML disfrazados). */
export async function assertSafeImageFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Formato no permitido. Usá JPG, PNG, WebP, AVIF o GIF.');
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ok =
    startsWith(header, [0xff, 0xd8, 0xff]) || // JPEG
    startsWith(header, [0x89, 0x50, 0x4e, 0x47]) || // PNG
    startsWith(header, [0x47, 0x49, 0x46, 0x38]) || // GIF
    (startsWith(header, [0x52, 0x49, 0x46, 0x46]) &&
      header[8] === 0x57 &&
      header[9] === 0x45 &&
      header[10] === 0x42 &&
      header[11] === 0x50) || // WEBP
    (header[4] === 0x66 &&
      header[5] === 0x74 &&
      header[6] === 0x79 &&
      header[7] === 0x70); // ISO BMFF (AVIF/HEIF ftyp)

  if (!ok) {
    throw new Error('El archivo no parece una imagen válida (cabecera incorrecta).');
  }
}

export { ALLOWED_MIME };
