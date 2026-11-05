import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDashboardCounts } from '../../services/adminApi';

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted">
          Los cambios publicados se ven en la web pública al instante, sin redeploy en Vercel.
        </p>
      </div>

      {error && (
        <div className="rounded-lg fg-admin-alert-error p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Servicios', value: counts.services, to: '/gestion/servicios' },
          { label: 'Trabajos', value: counts.projects, to: '/gestion/obras' },
          { label: 'Equipo', value: counts.team, to: '/gestion/equipo' },
          { label: 'Multimedia', value: counts.media, to: '/gestion/media' },
          {
            label: 'Secciones con borrador',
            value: counts.unpublishedSections,
            to: '/gestion/editor',
          },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-theme bg-[color:var(--page-bg)] p-5 shadow-sm transition hover:border-brand/40"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
