import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
  AdminAlert,
  AdminButton,
  AdminField,
  AdminInput,
} from '../../components/admin/adminUi';

export default function LoginPage() {
  const { login, session, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/gestion" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/gestion', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-navy-mid/30 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <img src="/futurgas.png" alt="Futurgas" className="h-10 w-auto" />
        </div>

        <div className="rounded-3xl border border-theme bg-surface p-7 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)] md:p-8">
          <div className="mb-7 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-brand">
              <LockClosedIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground">Gestión Futurgas</h1>
              <p className="mt-1 text-sm text-muted">Acceso exclusivo para administradores</p>
            </div>
          </div>

          {!configured && (
            <div className="mb-4">
              <AdminAlert tone="warning">
                Faltan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
              </AdminAlert>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <AdminField label="Correo">
              <AdminInput
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@futurgas.com"
              />
            </AdminField>

            <AdminField label="Contraseña">
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-theme bg-surface-elevated px-3.5 py-2.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-2 focus:ring-brand/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </AdminField>

            {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

            <AdminButton
              type="submit"
              variant="brand"
              disabled={submitting || !configured}
              className="w-full py-3"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              {submitting ? 'Ingresando…' : 'Iniciar sesión'}
            </AdminButton>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Panel privado · sin registro público
        </p>
      </div>
    </div>
  );
}
