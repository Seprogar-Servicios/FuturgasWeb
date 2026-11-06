import { useEffect, useState, type FormEvent } from 'react';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteTeamMember, fetchTeamAdmin, upsertTeamMember } from '../../services/adminApi';
import type { TeamMember } from '../../types/content';
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

const emptyForm = {
  name: '',
  role: '',
  photo_url: '',
  display_order: 0,
  is_visible: true,
};

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setItems(await fetchTeamAdmin());
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  function startEdit(item?: TeamMember) {
    if (!item) {
      setEditing(null);
      setForm(emptyForm);
      return;
    }
    setEditing(item);
    setForm({
      name: item.name,
      role: item.role || '',
      photo_url: item.photo_url || '',
      display_order: item.display_order,
      is_visible: item.is_visible,
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await upsertTeamMember({
        id: editing?.id,
        name: form.name,
        role: form.role || null,
        photo_url: form.photo_url || null,
        display_order: Number(form.display_order) || 0,
        is_visible: form.is_visible,
      });
      setMessage(editing ? 'Integrante actualizado' : 'Integrante creado');
      startEdit();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Equipo"
        description="Fotos y cargos de la sección Equipo del home."
        action={
          <AdminButton type="button" variant="brand" onClick={() => startEdit()}>
            <PlusIcon className="h-4 w-4" />
            Nuevo
          </AdminButton>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title={editing ? 'Editar integrante' : 'Nuevo integrante'}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nombre">
              <AdminInput
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Cargo">
              <AdminInput
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              />
            </AdminField>
            <AdminField label="URL de foto" className="md:col-span-2">
              <AdminInput
                value={form.photo_url}
                onChange={(e) => setForm((prev) => ({ ...prev, photo_url: e.target.value }))}
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
              label="Visible en el sitio"
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
            <AdminTh>Integrante</AdminTh>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh className="text-right">Acciones</AdminTh>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <AdminTd>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-elevated">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{item.role || 'Sin cargo'}</p>
                  </div>
                </div>
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
                      void deleteTeamMember(item.id)
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
