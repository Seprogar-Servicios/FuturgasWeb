import { useEffect, useState } from 'react';
import {
  deleteMediaItem,
  fetchMediaLibrary,
  updateMediaAlt,
  uploadMediaFile,
} from '../../services/adminApi';
import type { MediaItem } from '../../types/content';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setItems(await fetchMediaLibrary());
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.length) return;
    const file = fileList[0];
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError('Formato no permitido. Usá JPG, PNG, WebP, AVIF o GIF.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('El archivo supera 5 MB.');
      return;
    }
    setUploading(true);
    try {
      await uploadMediaFile(file);
      setMessage('Imagen subida');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Galería multimedia</h2>
        <p className="text-muted">Biblioteca de imágenes en Supabase Storage.</p>
      </div>

      {message && (
        <div className="rounded-lg fg-admin-alert-ok p-3 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg fg-admin-alert-error p-3 text-sm">
          {error}
        </div>
      )}

      <label className="fg-admin-panel flex cursor-pointer flex-col items-center justify-center border-dashed p-8 text-center hover:border-brand/40">
        <span className="font-medium">{uploading ? 'Subiendo…' : 'Subir imagen'}</span>
        <span className="mt-1 text-sm text-muted">Máx. 5 MB · JPG/PNG/WebP/AVIF/GIF</span>
        <input
          type="file"
          accept={ALLOWED.join(',')}
          className="hidden"
          disabled={uploading}
          onChange={(e) => void onUpload(e.target.files)}
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-xl border border-theme fg-admin-panel">
            <img src={item.public_url} alt={item.alt_text || item.filename} className="h-40 w-full object-cover" />
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">{item.filename}</p>
              <input
                className="w-full rounded border border-theme px-2 py-1 text-sm"
                defaultValue={item.alt_text || ''}
                placeholder="Texto alternativo"
                onBlur={(e) =>
                  void updateMediaAlt(item.id, e.target.value).catch((err) =>
                    setError(err instanceof Error ? err.message : 'Error')
                  )
                }
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() => void navigator.clipboard.writeText(item.public_url)}
                >
                  Copiar URL
                </button>
                <button
                  type="button"
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                  onClick={() =>
                    void deleteMediaItem(item)
                      .then(load)
                      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
