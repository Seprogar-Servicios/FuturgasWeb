import { useEffect, useMemo, useState } from 'react';
import {
  fetchSectionsAdmin,
  publishAllSections,
  publishSection,
  reorderSections,
  updateSectionDraft,
} from '../../services/adminApi';
import type { PageSection } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
  StatusBadge,
} from '../../components/admin/adminUi';

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
      setMessage('Borrador guardado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  async function publishCurrent() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await updateSectionDraft(selected.id, draft, { is_visible: selected.is_visible });
      const updated = await publishSection(selected.id);
      setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setMessage('Sección publicada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar');
    } finally {
      setSaving(false);
    }
  }

  async function publishAll() {
    setSaving(true);
    setError(null);
    try {
      await publishAllSections();
      await load();
      setMessage('Todas las secciones publicadas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar todo');
    } finally {
      setSaving(false);
    }
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setSections(next);
    try {
      await reorderSections(next.map((section) => section.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reordenar');
      await load();
    }
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
    <div className="space-y-8">
      <AdminPageHeader
        title="Editor visual"
        description="Editá bloques predefinidos. No se permite HTML ni CSS libre."
        action={
          <div className="flex flex-wrap gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => void saveDraft()}
              disabled={saving || !selected}
            >
              Guardar borrador
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              onClick={() => void publishCurrent()}
              disabled={saving || !selected}
            >
              Publicar sección
            </AdminButton>
            <AdminButton
              type="button"
              variant="brand"
              onClick={() => void publishAll()}
              disabled={saving}
            >
              Publicar todo
            </AdminButton>
          </div>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
        <AdminCard title="Secciones">
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div key={section.id} className="rounded-xl border border-theme p-2">
                <button
                  type="button"
                  onClick={() => selectSection(section)}
                  className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition ${
                    selectedId === section.id
                      ? 'bg-brand/15 font-semibold text-brand'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="font-medium text-foreground">
                    {section.title || section.section_type}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted">{section.section_type}</span>
                    <StatusBadge
                      active={!section.has_unpublished_changes}
                      activeLabel="Publicado"
                      inactiveLabel="Borrador"
                    />
                    {!section.is_visible ? (
                      <StatusBadge active={false} inactiveLabel="Oculta" />
                    ) : null}
                  </div>
                </button>
                <div className="mt-1 flex gap-1">
                  <AdminButton
                    type="button"
                    variant="ghost"
                    className="!px-2 !py-1 !text-xs"
                    onClick={() => void move(index, -1)}
                  >
                    Subir
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    className="!px-2 !py-1 !text-xs"
                    onClick={() => void move(index, 1)}
                  >
                    Bajar
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title={selected ? selected.title || selected.section_type : 'Editor'}>
          {!selected ? (
            <p className="text-muted">Seleccioná una sección para editarla.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge
                  active={selected.is_visible}
                  activeLabel="Visible"
                  inactiveLabel="Oculta"
                />
                <AdminButton type="button" variant="secondary" onClick={() => void toggleVisible()}>
                  {selected.is_visible ? 'Ocultar sección' : 'Mostrar sección'}
                </AdminButton>
              </div>

              {textFields.map((key) => (
                <AdminField key={key} label={FIELD_LABELS[key] || key}>
                  {String(draft[key] ?? '').length > 80 ? (
                    <AdminTextarea
                      value={String(draft[key] ?? '')}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  ) : (
                    <AdminInput
                      value={String(draft[key] ?? '')}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  )}
                </AdminField>
              ))}

              {isPlainObject(draft.primary_cta) && (
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="CTA principal · texto">
                    <AdminInput
                      value={String(draft.primary_cta.label ?? '')}
                      onChange={(e) => updateField('primary_cta.label', e.target.value)}
                    />
                  </AdminField>
                  <AdminField label="CTA principal · enlace">
                    <AdminInput
                      value={String(draft.primary_cta.href ?? '')}
                      onChange={(e) => updateField('primary_cta.href', e.target.value)}
                    />
                  </AdminField>
                </div>
              )}

              {isPlainObject(draft.secondary_cta) && (
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="CTA secundario · texto">
                    <AdminInput
                      value={String(draft.secondary_cta.label ?? '')}
                      onChange={(e) => updateField('secondary_cta.label', e.target.value)}
                    />
                  </AdminField>
                  <AdminField label="CTA secundario · enlace">
                    <AdminInput
                      value={String(draft.secondary_cta.href ?? '')}
                      onChange={(e) => updateField('secondary_cta.href', e.target.value)}
                    />
                  </AdminField>
                </div>
              )}

              {isPlainObject(draft.cta) && (
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="CTA · texto">
                    <AdminInput
                      value={String(draft.cta.label ?? '')}
                      onChange={(e) => updateField('cta.label', e.target.value)}
                    />
                  </AdminField>
                  <AdminField label="CTA · enlace">
                    <AdminInput
                      value={String(draft.cta.href ?? '')}
                      onChange={(e) => updateField('cta.href', e.target.value)}
                    />
                  </AdminField>
                </div>
              )}

              <div className="rounded-2xl border border-dashed border-theme bg-surface-elevated/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
                  Vista previa rápida
                </p>
                <p className="font-display text-xl font-bold text-foreground">
                  {String(draft.headline || draft.title || selected.title || '')}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {String(draft.subheadline || draft.body || '')}
                </p>
              </div>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
