import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { fetchAdminDashboardCounts } from '../../services/adminApi';
import { AdminAlert, AdminCard, AdminPageHeader } from '../../components/admin/adminUi';

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    services: 0,
    projects: 0,
    media: 0,
    unpublishedSections: 0,
    team: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAdminDashboardCounts()
      .then(setCounts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const cards = [
    {
      label: 'Servicios',
      value: counts.services,
      to: '/gestion/servicios',
      icon: WrenchScrewdriverIcon,
      hint: 'Catálogo público',
    },
    {
      label: 'Trabajos',
      value: counts.projects,
      to: '/gestion/obras',
      icon: Squares2X2Icon,
      hint: 'Obras y galería',
    },
    {
      label: 'Equipo',
      value: counts.team,
      to: '/gestion/equipo',
      icon: UserGroupIcon,
      hint: 'Integrantes visibles',
    },
    {
      label: 'Multimedia',
      value: counts.media,
      to: '/gestion/media',
      icon: PhotoIcon,
      hint: 'Biblioteca de imágenes',
    },
    {
      label: 'Borradores',
      value: counts.unpublishedSections,
      to: '/gestion/editor',
      icon: DocumentTextIcon,
      hint: 'Secciones sin publicar',
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Resumen"
        description="Los cambios publicados se ven en la web al instante, sin redeploy en Vercel."
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="group rounded-2xl border border-theme bg-surface p-5 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:border-brand/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted opacity-0 transition group-hover:text-brand group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-sm text-muted">{card.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{card.value}</p>
              <p className="mt-1 text-xs text-muted">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <AdminCard>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Publicación instantánea</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Guardá borradores sin tocar la web. Al publicar, las vistas públicas de Supabase
              actualizan el sitio al recargar.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminAlert tone="info">
        Tip: usá el interruptor de tema en la barra superior para trabajar en claro u oscuro.
      </AdminAlert>
    </div>
  );
}
