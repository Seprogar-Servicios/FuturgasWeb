import { useEffect, useState, type FormEvent } from 'react';
import { deleteTeamMember, fetchTeamAdmin, upsertTeamMember } from '../../services/adminApi';
import type { TeamMember } from '../../types/content';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Equipo</h2>
        <p className="text-slate-600">
          Fotos y cargos que se muestran en la sección Equipo del home.
        </p>
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

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">{editing ? 'Editar integrante' : 'Nuevo integrante'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Nombre"
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            placeholder="Cargo"
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
          <input
            placeholder="URL de foto"
            className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2"
            value={form.photo_url}
            onChange={(e) => setForm((prev) => ({ ...prev, photo_url: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Orden"
            className="rounded-lg border border-slate-300 px-3 py-2"
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
            Visible en el sitio
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
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                {item.photo_url ? (
                  <img src={item.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500">
                  {item.is_visible ? 'Visible' : 'Oculto'}
                  {item.role ? ` · ${item.role}` : ''}
                </p>
              </div>
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
                  void deleteTeamMember(item.id)
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
