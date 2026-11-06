import { useEffect, useState, type FormEvent } from 'react';
import {
  fetchSiteSettingsAdmin,
  publishSiteSettings,
  saveSiteSettingsDraft,
} from '../../services/adminApi';
import type { SiteSettingsPayload } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
} from '../../components/admin/adminUi';

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
    <div className="space-y-8">
      <AdminPageHeader
        title="Configuración"
        description="Datos de contacto, marca y SEO."
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title="Sitio y contacto">
        <form onSubmit={saveDraft} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nombre del sitio">
              <AdminInput
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Email">
              <AdminInput
                value={form.contact_email || ''}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              />
            </AdminField>
            <AdminField label="WhatsApp">
              <AdminInput
                value={form.whatsapp || ''}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="54911..."
              />
            </AdminField>
            <AdminField label="URL logo">
              <AdminInput
                value={form.logo_url || ''}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              />
            </AdminField>
            <AdminField label="SEO título">
              <AdminInput
                value={form.seo_settings.title || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    seo_settings: { ...form.seo_settings, title: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="SEO descripción" className="md:col-span-2">
              <AdminInput
                value={form.seo_settings.description || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    seo_settings: { ...form.seo_settings, description: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Instagram">
              <AdminInput
                value={form.social_links.instagram || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_links: { ...form.social_links, instagram: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Facebook">
              <AdminInput
                value={form.social_links.facebook || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_links: { ...form.social_links, facebook: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Teléfonos</p>
            {form.phones.map((phone, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-3">
                <AdminField label="Etiqueta">
                  <AdminInput
                    value={phone.label}
                    onChange={(e) => {
                      const phones = [...form.phones];
                      phones[index] = { ...phones[index], label: e.target.value };
                      setForm({ ...form, phones });
                    }}
                  />
                </AdminField>
                <AdminField label="Número">
                  <AdminInput
                    value={phone.number}
                    onChange={(e) => {
                      const phones = [...form.phones];
                      phones[index] = { ...phones[index], number: e.target.value };
                      setForm({ ...form, phones });
                    }}
                  />
                </AdminField>
                <AdminField label="tel:">
                  <AdminInput
                    value={phone.tel}
                    onChange={(e) => {
                      const phones = [...form.phones];
                      phones[index] = { ...phones[index], tel: e.target.value };
                      setForm({ ...form, phones });
                    }}
                  />
                </AdminField>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <AdminButton type="submit" variant="secondary">
              Guardar borrador
            </AdminButton>
            <AdminButton type="button" variant="brand" onClick={() => void publish()}>
              Publicar
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
