import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { useSiteData } from '../../contexts/SiteDataContext';

export default function Footer() {
  const { data } = useSiteData();
  const { settings, navigation, services } = data;
  const year = new Date().getFullYear();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.pageYOffset > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const social = [
    settings.social_links.facebook
      ? { name: 'Facebook', href: settings.social_links.facebook }
      : null,
    settings.social_links.instagram
      ? { name: 'Instagram', href: settings.social_links.instagram }
      : null,
    settings.whatsapp ? { name: 'WhatsApp', href: `https://wa.me/${settings.whatsapp}` } : null,
  ].filter(Boolean) as { name: string; href: string }[];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0b1220] to-[#070b14] pb-12 pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-light/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src={settings.logo_url || '/futurgas.png'}
                alt={settings.site_name}
                className="h-10 w-auto"
              />
              <span className="font-display text-xl font-bold">{settings.site_name}</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-300">
              Especialistas en instalaciones de gas para la construcción: obras nuevas, redes de
              distribución, tendido de cañerías y adecuaciones.
            </p>
            <div className="flex gap-2">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
                  aria-label={item.name}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display mb-4 text-sm font-bold uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={item.url} className="text-sm text-slate-300 transition hover:text-brand-light">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display mb-4 text-sm font-bold uppercase tracking-wider">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href="#servicios"
                    className="text-sm text-slate-300 transition hover:text-brand-light"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display mb-4 text-sm font-bold uppercase tracking-wider">
              Contacto
            </h3>
            <address className="not-italic space-y-2.5 text-sm text-slate-300">
              {settings.phones.map((phone) => (
                <div key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className="transition hover:text-brand-light">
                    {phone.number}
                  </a>
                  <span className="ml-1 text-xs text-slate-500">({phone.label})</span>
                </div>
              ))}
              {settings.contact_email && (
                <div>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="transition hover:text-brand-light"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
            </address>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-slate-400">
            &copy; {year} {settings.site_name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-500">Grupo empresarial · Instalaciones de gas</p>
        </div>
      </div>

      {showScroll ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-40 rounded-full bg-brand p-3 text-white shadow-brand transition hover:brightness-110"
          aria-label="Volver arriba"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      ) : null}
    </footer>
  );
}
