import { useEffect, useMemo, useState } from 'react';
import {
  fetchSectionsAdmin,
  publishAllSections,
  publishSection,
  reorderSections,
  updateSectionDraft,
} from '../../services/adminApi';
import type { PageSection } from '../../types/content';

const FIELD_LABELS: Record<string, string> = {
  eyebrow: 'Antetítulo',
  headline: 'Título',
  highlight: 'Palabra destacada',
  subheadline: 'Subtítulo',
  body: 'Descripción',
  image_url: 'URL de imagen',
  image_alt: 'Texto alternativo',
  empty_message: 'Mensaje vacío',
  whatsapp_placeholder: 'Placeholder WhatsApp',
  whatsapp_default_message: 'Mensaje WhatsApp por defecto',
  whatsapp_button_label: 'Texto botón WhatsApp',
  hours_note: 'Nota de horarios',
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export default function EditorPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => sections.find((section) => section.id === selectedId) ?? null,
    [sections, selectedId]
  );

  async function load() {
    const data = await fetchSectionsAdmin();
    setSections(data);
    if (!selectedId && data[0]) {
      setSelectedId(data[0].id);
      setDraft(data[0].draft_content || {});
    } else if (selectedId) {
      const current = data.find((item) => item.id === selectedId);
      if (current) setDraft(current.draft_content || {});
    }
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectSection(section: PageSection) {
    setSelectedId(section.id);
    setDraft(section.draft_content || {});
    setMessage(null);
    setError(null);
  }

  function updateField(path: string, value: unknown) {
    setDraft((prev) => {
      const next = { ...prev };
      if (path === 'primary_cta.label' || path === 'primary_cta.href') {
        const cta = isPlainObject(next.primary_cta) ? { ...next.primary_cta } : {};
        cta[path.split('.')[1]] = value;
        next.primary_cta = cta;
        return next;
      }
      if (path === 'secondary_cta.label' || path === 'secondary_cta.href') {
        const cta = isPlainObject(next.secondary_cta) ? { ...next.secondary_cta } : {};
        cta[path.split('.')[1]] = value;
        next.secondary_cta = cta;
        return next;
      }
      if (path === 'cta.label' || path === 'cta.href') {
        const cta = isPlainObject(next.cta) ? { ...next.cta } : {};
        cta[path.split('.')[1]] = value;
        next.cta = cta;
        return next;
      }
      next[path] = value;
      return next;
    });
  }

  async function saveDraft() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSectionDraft(selected.id, draft, {
        is_visible: selected.is_visible,
      });
      setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setMessage('Borrador guardado. La web pública aún muestra la versión publicada.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  async function publishCurrent() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateSectionDraft(selected.id, draft);
      const updated = await publishSection(selected.id);
      setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setDraft(updated.draft_content || {});
      setMessage('Sección publicada. Los cambios ya están visibles en la web.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar');
    } finally {
      setSaving(false);
    }
  }

  async function publishAll() {
    setSaving(true);
    try {
      if (selected) await updateSectionDraft(selected.id, draft);
      await publishAllSections();
      await load();
      setMessage('Todas las secciones con cambios fueron publicadas.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar');
    } finally {
      setSaving(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const ordered = [...sections];
    const [item] = ordered.splice(index, 1);
    ordered.splice(target, 0, item);
    setSections(ordered);
    await reorderSections(ordered.map((section) => section.id));
  }

  async function toggleVisible() {
    if (!selected) return;
    const updated = await updateSectionDraft(selected.id, draft, {
      is_visible: !selected.is_visible,
    });
    setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }

  const textFields = Object.keys(draft).filter((key) => typeof draft[key] === 'string');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Editor visual</h2>
          <p className="text-slate-600">
            Editá bloques predefinidos. No se permite HTML ni CSS libre.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void saveDraft()}
            disabled={saving || !selected}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => void publishCurrent()}
            disabled={saving || !selected}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            Publicar sección
          </button>
          <button
            type="button"
            onClick={() => void publishAll()}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            Publicar todo
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold">Secciones</h3>
          {sections.map((section, index) => (
            <div key={section.id} className="rounded-lg border border-slate-200 p-2">
              <button
                type="button"
                onClick={() => selectSection(section)}
                className={`w-full rounded-md px-2 py-2 text-left text-sm ${
                  selectedId === section.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                }`}
              >
                <div className="font-medium">{section.title || section.section_type}</div>
                <div className="text-xs text-slate-500">
                  {section.section_type}
                  {section.has_unpublished_changes ? ' · borrador' : ' · publicado'}
                  {!section.is_visible ? ' · oculta' : ''}
                </div>
              </button>
              <div className="mt-1 flex gap-1">
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs"
                  onClick={() => void move(index, -1)}
                >
                  Subir
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-0.5 text-xs"
                  onClick={() => void move(index, 1)}
                >
                  Bajar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          {!selected ? (
            <p className="text-slate-500">Seleccioná una sección para editarla.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {selected.title || selected.section_type}
                </h3>
                <button
                  type="button"
                  onClick={() => void toggleVisible()}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  {selected.is_visible ? 'Ocultar sección' : 'Mostrar sección'}
                </button>
              </div>

              {textFields.map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {FIELD_LABELS[key] || key}
                  </label>
                  {String(draft[key] ?? '').length > 80 ? (
                    <textarea
                      className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft[key] ?? '')}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft[key] ?? '')}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {isPlainObject(draft.primary_cta) && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA principal · texto</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.primary_cta.label ?? '')}
                      onChange={(e) => updateField('primary_cta.label', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA principal · enlace</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.primary_cta.href ?? '')}
                      onChange={(e) => updateField('primary_cta.href', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isPlainObject(draft.secondary_cta) && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA secundario · texto</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.secondary_cta.label ?? '')}
                      onChange={(e) => updateField('secondary_cta.label', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA secundario · enlace</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.secondary_cta.href ?? '')}
                      onChange={(e) => updateField('secondary_cta.href', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isPlainObject(draft.cta) && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA · texto</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.cta.label ?? '')}
                      onChange={(e) => updateField('cta.label', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA · enlace</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={String(draft.cta.href ?? '')}
                      onChange={(e) => updateField('cta.href', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Vista previa rápida</p>
                <p className="text-xl font-bold text-slate-900">
                  {String(draft.headline || draft.title || selected.title || '')}
                </p>
                <p className="mt-2 text-slate-600">
                  {String(draft.subheadline || draft.body || '')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
