import { useEffect, useState, type FormEvent } from 'react';
import {
  fetchSiteSettingsAdmin,
  publishSiteSettings,
  saveSiteSettingsDraft,
} from '../../services/adminApi';
import type { SiteSettingsPayload } from '../../types/content';

export default function SettingsPage() {
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettingsPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchSiteSettingsAdmin()
      .then((settings) => {
        if (!settings) return;
        setId(settings.id);
        const payload =
          settings.draft_payload ||
          settings.published_payload ||
          ({
            site_name: settings.site_name,
            logo_url: settings.logo_url,
            favicon_url: settings.favicon_url,
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            contact_email: settings.contact_email,
            phones: settings.phones,
            whatsapp: settings.whatsapp,
            address: settings.address,
            social_links: settings.social_links,
            seo_settings: settings.seo_settings,
          } as SiteSettingsPayload);
        setForm(payload);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'));
  }, []);

  async function saveDraft(event: FormEvent) {
    event.preventDefault();
    if (!id || !form) return;
    try {
      await saveSiteSettingsDraft(form, id);
      setMessage('Borrador de configuración guardado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  async function publish() {
    if (!id || !form) return;
    try {
      await publishSiteSettings(id, form);
      setMessage('Configuración publicada en la web');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar');
    }
  }

  if (!form) {
    return <p className="text-muted">Cargando configuración…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración general</h2>
        <p className="text-muted">Datos de contacto, marca y SEO.</p>
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

      <form onSubmit={saveDraft} className="space-y-4 rounded-2xl border border-theme fg-admin-panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
            placeholder="Nombre del sitio"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.contact_email || ''}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            placeholder="Email"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.whatsapp || ''}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="WhatsApp (54911...)"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.logo_url || ''}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            placeholder="URL logo"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.seo_settings.title || ''}
            onChange={(e) =>
              setForm({
                ...form,
                seo_settings: { ...form.seo_settings, title: e.target.value },
              })
            }
            placeholder="SEO título"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2 md:col-span-2"
            value={form.seo_settings.description || ''}
            onChange={(e) =>
              setForm({
                ...form,
                seo_settings: { ...form.seo_settings, description: e.target.value },
              })
            }
            placeholder="SEO descripción"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.social_links.instagram || ''}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, instagram: e.target.value },
              })
            }
            placeholder="Instagram URL"
          />
          <input
            className="rounded-lg border border-theme px-3 py-2"
            value={form.social_links.facebook || ''}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, facebook: e.target.value },
              })
            }
            placeholder="Facebook URL"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Teléfonos</p>
          {form.phones.map((phone, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-3">
              <input
                className="rounded-lg border border-theme px-3 py-2"
                value={phone.label}
                onChange={(e) => {
                  const phones = [...form.phones];
                  phones[index] = { ...phones[index], label: e.target.value };
                  setForm({ ...form, phones });
                }}
                placeholder="Etiqueta"
              />
              <input
                className="rounded-lg border border-theme px-3 py-2"
                value={phone.number}
                onChange={(e) => {
                  const phones = [...form.phones];
                  phones[index] = { ...phones[index], number: e.target.value };
                  setForm({ ...form, phones });
                }}
                placeholder="Número visible"
              />
              <input
                className="rounded-lg border border-theme px-3 py-2"
                value={phone.tel}
                onChange={(e) => {
                  const phones = [...form.phones];
                  phones[index] = { ...phones[index], tel: e.target.value };
                  setForm({ ...form, phones });
                }}
                placeholder="tel:+549..."
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="rounded-lg border px-4 py-2">
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => void publish()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
