import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { ContactContent, SiteSettingsPayload } from '../../types/content';

type Props = {
  content: ContactContent;
  settings: SiteSettingsPayload;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function Contact({ content, settings }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const whatsapp = settings.whatsapp || '5491136250298';
  const defaultMsg =
    content.whatsapp_default_message ||
    'Hola, quiero hacer una consulta sobre instalaciones de gas desde la web de Futurgas.';

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const composed = `Hola, mi nombre es ${form.name.trim()}.
Les escribo desde el formulario de contacto de Futurgas.

Teléfono: ${form.phone.trim() || 'No indicado'}
Email: ${form.email.trim() || 'No indicado'}

Mensaje:
${form.message.trim() || defaultMsg}

Gracias.`;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(composed)}`, '_blank');
    setForm(emptyForm);
  }

  const inputClass =
    'w-full rounded-xl border border-theme bg-[color:var(--page-bg)] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-2 focus:ring-brand/20';

  return (
    <section id="contacto" className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-deep/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-2xl text-center md:mb-12"
        >
          {content.eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {content.eyebrow}
            </p>
          )}
          <h2 className="font-display mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
            {content.headline}
          </h2>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-brand-light" />
          {content.subheadline && (
            <p className="text-sm leading-relaxed text-muted md:text-base">{content.subheadline}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-theme bg-surface p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.4)] md:p-8 lg:col-span-7"
          >
            <div className="mb-6">
              <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                Enviá tu consulta
              </h3>
              <p className="mt-1 text-sm text-muted">
                Completá el formulario y lo abrimos en WhatsApp listo para enviar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                  <input
                    id="contact-name"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="tucorreo@ejemplo.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Teléfono
                  </label>
                  <div className="relative">
                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="Tu número"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={`${inputClass} min-h-[140px] resize-y`}
                  placeholder={
                    content.whatsapp_placeholder ||
                    'Contanos el tipo de trabajo, la zona y cualquier detalle útil…'
                  }
                />
              </div>

              <button type="submit" className="btn-brand w-full gap-2 sm:w-auto sm:min-w-[240px]">
                <PaperAirplaneIcon className="h-4 w-4" />
                {content.whatsapp_button_label || 'Enviar por WhatsApp'}
              </button>
            </form>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col gap-4 lg:col-span-5"
          >
            <div className="rounded-3xl border border-theme bg-surface p-6 md:p-7">
              <h3 className="font-display mb-4 text-lg font-bold text-foreground">
                Datos de contacto
              </h3>
              <ul className="space-y-4">
                {settings.phones.map((phone) => (
                  <li key={phone.tel} className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{phone.label}</p>
                      <a
                        href={`tel:${phone.tel}`}
                        className="text-sm text-muted transition hover:text-brand"
                      >
                        {phone.number}
                      </a>
                    </div>
                  </li>
                ))}
                {settings.contact_email && (
                  <li className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <EnvelopeIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="break-all text-sm text-muted transition hover:text-brand"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </li>
                )}
                {content.hours_note && (
                  <li className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <ClockIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Horario</p>
                      <p className="text-sm text-muted">{content.hours_note}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-1 flex-col justify-between rounded-3xl border border-theme bg-gradient-to-br from-brand to-brand-deep p-6 text-white md:p-7">
              <div>
                <p className="font-display text-lg font-bold">¿Preferís escribir directo?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  Si ya tenés zona y tipo de trabajo, mandanos un WhatsApp y te orientamos con la
                  próxima acción.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(defaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-white/35 bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
              >
                Abrir WhatsApp
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
