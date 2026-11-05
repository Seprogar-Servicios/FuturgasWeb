import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const links = [
  { to: '/gestion', label: 'Dashboard', end: true },
  { to: '/gestion/editor', label: 'Editor visual' },
  { to: '/gestion/servicios', label: 'Servicios' },
  { to: '/gestion/obras', label: 'Trabajos' },
  { to: '/gestion/equipo', label: 'Equipo' },
  { to: '/gestion/media', label: 'Multimedia' },
  { to: '/gestion/navegacion', label: 'Navegación' },
  { to: '/gestion/configuracion', label: 'Configuración' },
  { to: '/gestion/perfil', label: 'Perfil' },
];

export default function AdminLayout() {
  const { session, loading, logout, user, configured } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--page-bg)] font-display text-muted">
        Verificando sesión…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--page-bg)] px-4 text-amber-600">
        Configurá Supabase en `.env` para usar el panel.
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/gestion/login" replace />;
  }

  return (
    <div className="fg-admin min-h-screen">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="fg-admin-sidebar w-full border-b border-slate-800 text-slate-100 md:w-64 md:border-b-0 md:border-r">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-brand to-brand-light" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Futurgas CMS
            </p>
            <h1 className="font-display text-lg font-bold tracking-tight">Panel de gestión</h1>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-brand to-brand-deep text-white shadow-brand'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="fg-admin-topbar flex items-center justify-between px-4 py-3 backdrop-blur md:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Sesión activa
              </p>
              <p className="font-display font-semibold text-foreground">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-theme px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
              >
                Ver web
              </a>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Cerrar sesión
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="fg-admin-card p-5 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
