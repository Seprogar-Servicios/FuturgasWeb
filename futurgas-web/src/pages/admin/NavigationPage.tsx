import { useEffect, useState, type FormEvent } from 'react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  deleteNavigationItem,
  fetchNavigationAdmin,
  upsertNavigationItem,
} from '../../services/adminApi';
import type { NavigationItem } from '../../types/content';
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
  AdminTh,
  IconActionButton,
  StatusBadge,
} from '../../components/admin/adminUi';

const emptyForm = { label: '', url: '', display_order: 0, is_visible: true };

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await fetchNavigationAdmin());
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await upsertNavigationItem({
        id: editingId || undefined,
        ...form,
        display_order: Number(form.display_order) || 0,
      });
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Navegación"
        description="Menú principal de la web pública."
        action={
          <AdminButton type="button" variant="brand" onClick={resetForm}>
            <PlusIcon className="h-4 w-4" />
            Nuevo
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title={editingId ? 'Editar ítem' : 'Nuevo ítem'}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Etiqueta">
              <AdminInput
                required
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              />
            </AdminField>
            <AdminField label="URL" hint="Ej: #servicios o /#contacto">
              <AdminInput
                required
                value={form.url}
                onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
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
              label="Visible"
              checked={form.is_visible}
              onChange={(is_visible) => setForm((prev) => ({ ...prev, is_visible }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton type="submit" variant="primary">
              {editingId ? 'Actualizar' : 'Agregar'}
            </AdminButton>
            {editingId ? (
              <AdminButton type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </AdminButton>
            ) : null}
          </div>
        </form>
      </AdminCard>

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Ítem</AdminTh>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh className="text-right">Acciones</AdminTh>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <AdminTd>
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-muted">{item.url}</p>
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
                  <IconActionButton
                    label="Editar"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        label: item.label,
                        url: item.url,
                        display_order: item.display_order,
                        is_visible: item.is_visible,
                      });
                    }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </IconActionButton>
                  <IconActionButton
                    label="Eliminar"
                    tone="danger"
                    onClick={() =>
                      void deleteNavigationItem(item.id)
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
