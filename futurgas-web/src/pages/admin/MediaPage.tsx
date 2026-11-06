import { useEffect, useState } from 'react';
import { ArrowUpTrayIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  deleteMediaItem,
  fetchMediaLibrary,
  updateMediaAlt,
  uploadMediaFile,
} from '../../services/adminApi';
import type { MediaItem } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminInput,
  AdminPageHeader,
  IconActionButton,
} from '../../components/admin/adminUi';

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
    <div className="space-y-8">
      <AdminPageHeader
        title="Multimedia"
        description="Biblioteca de imágenes en Supabase Storage."
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-theme bg-surface p-10 text-center shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] transition hover:border-brand/40">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <ArrowUpTrayIcon className="h-5 w-5" />
        </span>
        <span className="font-semibold text-foreground">
          {uploading ? 'Subiendo…' : 'Subir imagen'}
        </span>
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
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-theme bg-surface shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)]"
          >
            <img
              src={item.public_url}
              alt={item.alt_text || item.filename}
              className="h-40 w-full object-cover"
            />
            <div className="space-y-3 p-4">
              <p className="truncate text-sm font-semibold text-foreground">{item.filename}</p>
              <AdminInput
                defaultValue={item.alt_text || ''}
                placeholder="Texto alternativo"
                className="!mt-0"
                onBlur={(e) =>
                  void updateMediaAlt(item.id, e.target.value).catch((err) =>
                    setError(err instanceof Error ? err.message : 'Error')
                  )
                }
              />
              <div className="flex items-center gap-1">
                <AdminButton
                  type="button"
                  variant="secondary"
                  className="!px-3 !py-1.5 !text-xs"
                  onClick={() => void navigator.clipboard.writeText(item.public_url)}
                >
                  <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                  Copiar URL
                </AdminButton>
                <IconActionButton
                  label="Eliminar"
                  tone="danger"
                  onClick={() =>
                    void deleteMediaItem(item)
                      .then(load)
                      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                </IconActionButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
