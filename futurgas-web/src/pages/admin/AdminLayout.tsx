import { NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  PhotoIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const links = [
  { to: '/gestion', label: 'Resumen', end: true, icon: HomeIcon },
  { to: '/gestion/editor', label: 'Editor', icon: DocumentTextIcon },
  { to: '/gestion/servicios', label: 'Servicios', icon: WrenchScrewdriverIcon },
  { to: '/gestion/obras', label: 'Trabajos', icon: Squares2X2Icon },
  { to: '/gestion/equipo', label: 'Equipo', icon: UserGroupIcon },
  { to: '/gestion/media', label: 'Media', icon: PhotoIcon },
  { to: '/gestion/navegacion', label: 'Menú', icon: Bars3BottomLeftIcon },
  { to: '/gestion/configuracion', label: 'Config', icon: Cog6ToothIcon },
  { to: '/gestion/perfil', label: 'Perfil', icon: UserCircleIcon },
];

export default function AdminLayout() {
  const { session, loading, logout, user, configured } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-display text-muted">
        Verificando sesión…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-amber-600">
        Configurá Supabase en `.env` para usar el panel.
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/gestion/login" replace />;
  }

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-theme bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/futurgas.png" alt="" className="h-9 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">Futurgas</p>
              <h1 className="font-display truncate text-base font-extrabold text-foreground sm:text-lg">
                Panel de gestión
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-theme px-3 py-2 text-xs font-medium text-muted transition hover:border-brand/40 hover:text-foreground sm:inline-flex"
            >
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              Ver web
            </a>
            <ThemeToggle />
            <span className="hidden max-w-[180px] truncate text-xs text-muted md:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-xl border border-theme bg-surface-elevated px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand/40 hover:text-brand"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pb-3">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-brand/15 font-semibold text-brand'
                    : 'text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
