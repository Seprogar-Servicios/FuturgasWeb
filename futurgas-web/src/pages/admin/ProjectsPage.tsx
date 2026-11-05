import { useEffect, useState, type FormEvent } from 'react';
import {
  deleteProject,
  fetchProjectsAdmin,
  fetchServicesAdmin,
  upsertProject,
} from '../../services/adminApi';
import type { ProjectItem, ServiceItem } from '../../types/content';

const emptyForm = {
  title: '',
  description: '',
  cover_image: '',
  category: '',
  location: '',
  completion_date: '',
  service_slug: '',
  is_published: false,
  display_order: 0,
};

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [projects, svc] = await Promise.all([fetchProjectsAdmin(), fetchServicesAdmin()]);
    setItems(projects);
    setServices(svc);
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  function startEdit(item?: ProjectItem) {
    if (!item) {
      setEditing(null);
      setForm(emptyForm);
      return;
    }
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      cover_image: item.cover_image || '',
      category: item.category || '',
      location: item.location || '',
      completion_date: item.completion_date || '',
      service_slug: item.service_slug || '',
      is_published: item.is_published,
      display_order: item.display_order,
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await upsertProject({
        id: editing?.id,
        title: form.title,
        description: form.description,
        cover_image: form.cover_image || null,
        category: form.category || null,
        location: form.location || null,
        completion_date: form.completion_date || null,
        service_slug: form.service_slug || null,
        is_published: form.is_published,
        display_order: Number(form.display_order) || 0,
      });
      setMessage(editing ? 'Trabajo actualizado' : 'Trabajo creado');
      startEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trabajos / obras</h2>
        <p className="text-muted">
          Cada trabajo se asocia a un servicio y sus fotos aparecen en la galería del home.
        </p>
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
        <h3 className="font-semibold">{editing ? 'Editar trabajo' : 'Nuevo trabajo'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Título"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <select
            required
            className="rounded-lg border border-theme px-3 py-2"
            value={form.service_slug}
            onChange={(e) => setForm((prev) => ({ ...prev, service_slug: e.target.value }))}
          >
            <option value="">Servicio asociado</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.slug}>
                {svc.title}
              </option>
            ))}
          </select>
          <input
            placeholder="Categoría (opcional)"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <textarea
            required
            placeholder="Descripción"
            className="min-h-24 rounded-lg border border-theme px-3 py-2 md:col-span-2"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <input
            placeholder="URL imagen de portada"
            className="rounded-lg border border-theme px-3 py-2 md:col-span-2"
            value={form.cover_image}
            onChange={(e) => setForm((prev) => ({ ...prev, cover_image: e.target.value }))}
          />
          <input
            placeholder="Ubicación"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
          <input
            type="date"
            className="rounded-lg border border-theme px-3 py-2"
            value={form.completion_date}
            onChange={(e) => setForm((prev) => ({ ...prev, completion_date: e.target.value }))}
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
              checked={form.is_published}
              onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
            />
            Publicado
          </label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Guardar
          </button>
          {editing && (
            <button type="button" className="rounded-lg border px-4 py-2" onClick={() => startEdit()}>
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
                {item.is_published ? 'Publicado' : 'Borrador'}
                {item.service_slug ? ` · ${item.service_slug}` : ''}
                {item.location ? ` · ${item.location}` : ''}
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
                  void deleteProject(item.id)
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
