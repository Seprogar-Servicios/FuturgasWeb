import { useEffect, useState, type FormEvent } from 'react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  deleteProject,
  fetchProjectsAdmin,
  fetchServicesAdmin,
  upsertProject,
} from '../../services/adminApi';
import type { ProjectItem, ServiceItem } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSwitch,
  AdminTable,
  AdminTd,
  AdminTextarea,
  AdminTh,
  IconActionButton,
  StatusBadge,
} from '../../components/admin/adminUi';

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
    <div className="space-y-8">
      <AdminPageHeader
        title="Trabajos"
        description="Cada obra se asocia a un servicio y alimenta la galería del home."
        action={
          <AdminButton type="button" variant="brand" onClick={() => startEdit()}>
            <PlusIcon className="h-4 w-4" />
            Nuevo
          </AdminButton>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title={editing ? 'Editar trabajo' : 'Nuevo trabajo'}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Título">
              <AdminInput
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Servicio asociado">
              <AdminSelect
                required
                value={form.service_slug}
                onChange={(e) => setForm((prev) => ({ ...prev, service_slug: e.target.value }))}
              >
                <option value="">Elegir servicio</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.slug}>
                    {svc.title}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Categoría">
              <AdminInput
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Ubicación">
              <AdminInput
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Descripción" className="md:col-span-2">
              <AdminTextarea
                required
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </AdminField>
            <AdminField label="URL imagen de portada" className="md:col-span-2">
              <AdminInput
                value={form.cover_image}
                onChange={(e) => setForm((prev) => ({ ...prev, cover_image: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Fecha">
              <AdminInput
                type="date"
                value={form.completion_date}
                onChange={(e) => setForm((prev) => ({ ...prev, completion_date: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Orden">
              <AdminInput
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))
                }
              />
            </AdminField>
            <AdminSwitch
              label="Publicado"
              description="Visible en la web pública"
              checked={form.is_published}
              onChange={(is_published) => setForm((prev) => ({ ...prev, is_published }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton type="submit" variant="primary">
              Guardar
            </AdminButton>
            {editing ? (
              <AdminButton type="button" variant="secondary" onClick={() => startEdit()}>
                Cancelar
              </AdminButton>
            ) : null}
          </div>
        </form>
      </AdminCard>

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Trabajo</AdminTh>
            <AdminTh>Servicio</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh className="text-right">Acciones</AdminTh>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <AdminTd>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.location || 'Sin ubicación'}</p>
              </AdminTd>
              <AdminTd>{item.service_slug || '—'}</AdminTd>
              <AdminTd>
                <StatusBadge active={item.is_published} />
              </AdminTd>
              <AdminTd className="text-right">
                <div className="inline-flex gap-1">
                  <IconActionButton label="Editar" onClick={() => startEdit(item)}>
                    <PencilSquareIcon className="h-4 w-4" />
                  </IconActionButton>
                  <IconActionButton
                    label="Eliminar"
                    tone="danger"
                    onClick={() =>
                      void deleteProject(item.id)
                        .then(load)
                        .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconActionButton>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}
