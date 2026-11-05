import { useEffect, useState, type FormEvent } from 'react';
import {
  deleteNavigationItem,
  fetchNavigationAdmin,
  upsertNavigationItem,
} from '../../services/adminApi';
import type { NavigationItem } from '../../types/content';

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [form, setForm] = useState({ label: '', url: '', display_order: 0, is_visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await fetchNavigationAdmin());
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await upsertNavigationItem({
        id: editingId || undefined,
        ...form,
        display_order: Number(form.display_order) || 0,
      });
      setForm({ label: '', url: '', display_order: 0, is_visible: true });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Navegación</h2>
        <p className="text-slate-600">Menú principal de la web pública.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <input
          required
          placeholder="Etiqueta"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.label}
          onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
        />
        <input
          required
          placeholder="URL (#servicios)"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.url}
          onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Orden"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={form.display_order}
          onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">
                {item.label} <span className="text-slate-400">→ {item.url}</span>
              </p>
              <p className="text-sm text-slate-500">
                Orden {item.display_order} · {item.is_visible ? 'Visible' : 'Oculto'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5 text-sm"
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
                Editar
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700"
                onClick={() =>
                  void deleteNavigationItem(item.id)
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
