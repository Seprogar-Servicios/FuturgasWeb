import { useEffect, useState, type FormEvent } from 'react';
import { deleteService, fetchServicesAdmin, upsertService } from '../../services/adminApi';
import type { ServiceItem } from '../../types/content';

const emptyForm = {
  title: '',
  description: '',
  featuresText: '',
  icon_key: 'fire',
  color_from: '#f59e0b',
  color_to: '#d97706',
  is_visible: true,
  display_order: 0,
};

export default function ServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await fetchServicesAdmin());
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  function startEdit(item?: ServiceItem) {
    if (!item) {
      setEditing(null);
      setForm(emptyForm);
      return;
    }
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      featuresText: item.features.join('\n'),
      icon_key: item.icon_key,
      color_from: item.color_from,
      color_to: item.color_to,
      is_visible: item.is_visible,
      display_order: item.display_order,
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await upsertService({
        id: editing?.id,
        title: form.title,
        description: form.description,
        features: form.featuresText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        icon_key: form.icon_key,
        color_from: form.color_from,
        color_to: form.color_to,
        is_visible: form.is_visible,
        display_order: Number(form.display_order) || 0,
      });
      setMessage(editing ? 'Servicio actualizado' : 'Servicio creado');
      startEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Servicios</h2>
        <p className="text-muted">Gestión de servicios visibles en la web pública.</p>
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

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-theme fg-admin-panel p-5">
        <h3 className="font-semibold">{editing ? 'Editar servicio' : 'Nuevo servicio'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Título"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <input
            placeholder="Icono (fire, network, pipe, wrench, building)"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.icon_key}
            onChange={(e) => setForm((prev) => ({ ...prev, icon_key: e.target.value }))}
          />
          <textarea
            required
            placeholder="Descripción"
            className="min-h-24 rounded-lg border border-theme px-3 py-2 md:col-span-2"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <textarea
            placeholder="Características (una por línea)"
            className="min-h-24 rounded-lg border border-theme px-3 py-2 md:col-span-2"
            value={form.featuresText}
            onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
          />
          <input
            type="color"
            value={form.color_from}
            onChange={(e) => setForm((prev) => ({ ...prev, color_from: e.target.value }))}
          />
          <input
            type="color"
            value={form.color_to}
            onChange={(e) => setForm((prev) => ({ ...prev, color_to: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Orden"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.display_order}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => setForm((prev) => ({ ...prev, is_visible: e.target.checked }))}
            />
            Visible en la web
          </label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Guardar
          </button>
          {editing && (
            <button
              type="button"
              className="rounded-lg border px-4 py-2"
              onClick={() => startEdit()}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-theme fg-admin-panel p-4"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">
                Orden {item.display_order} · {item.is_visible ? 'Visible' : 'Oculto'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5 text-sm"
                onClick={() => startEdit(item)}
              >
                Editar
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700"
                onClick={() =>
                  void deleteService(item.id)
                    .then(load)
                    .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
