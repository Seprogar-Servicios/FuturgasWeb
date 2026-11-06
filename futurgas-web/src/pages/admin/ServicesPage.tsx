import { useEffect, useState, type FormEvent } from 'react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteService, fetchServicesAdmin, upsertService } from '../../services/adminApi';
import type { ServiceItem } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
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
    <div className="space-y-8">
      <AdminPageHeader
        title="Servicios"
        description="Catálogo visible en la web pública."
        action={
          <AdminButton type="button" variant="brand" onClick={() => startEdit()}>
            <PlusIcon className="h-4 w-4" />
            Nuevo
          </AdminButton>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title={editing ? 'Editar servicio' : 'Nuevo servicio'}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Título">
              <AdminInput
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Ícono" hint="fire, network, pipe, wrench, building">
              <AdminInput
                value={form.icon_key}
                onChange={(e) => setForm((prev) => ({ ...prev, icon_key: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Descripción" className="md:col-span-2">
              <AdminTextarea
                required
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Características" hint="Una por línea" className="md:col-span-2">
              <AdminTextarea
                value={form.featuresText}
                onChange={(e) => setForm((prev) => ({ ...prev, featuresText: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Color desde">
              <AdminInput
                type="color"
                value={form.color_from}
                onChange={(e) => setForm((prev) => ({ ...prev, color_from: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Color hasta">
              <AdminInput
                type="color"
                value={form.color_to}
                onChange={(e) => setForm((prev) => ({ ...prev, color_to: e.target.value }))}
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
              label="Visible en la web"
              checked={form.is_visible}
              onChange={(is_visible) => setForm((prev) => ({ ...prev, is_visible }))}
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
            <AdminTh>Servicio</AdminTh>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh className="text-right">Acciones</AdminTh>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <AdminTd>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.icon_key}</p>
              </AdminTd>
              <AdminTd>{item.display_order}</AdminTd>
              <AdminTd>
                <StatusBadge
                  active={item.is_visible}
                  activeLabel="Visible"
                  inactiveLabel="Oculto"
                />
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
                      void deleteService(item.id)
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
