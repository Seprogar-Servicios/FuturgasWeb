import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

export default function LoginPage() {
  const { login, session, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 mesh-grid opacity-40" />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-2xl border border-theme bg-surface p-8 shadow-sm"
      >
        <div className="mb-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand to-brand-light" />
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Futurgas</p>
        <h1 className="font-display mb-2 text-3xl font-extrabold text-foreground">Gestión</h1>
        <p className="mb-8 text-sm text-muted">Acceso exclusivo para administradores</p>

        {!configured && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-200">
            Faltan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-muted" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-full border border-theme bg-[color:var(--page-bg)] px-4 py-2.5 text-foreground outline-none transition focus:border-brand/50"
        />

        <label className="mb-2 block text-sm font-medium text-muted" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-full border border-theme bg-[color:var(--page-bg)] px-4 py-2.5 text-foreground outline-none transition focus:border-brand/50"
        />

        <button type="submit" disabled={submitting || !configured} className="btn-brand w-full disabled:opacity-60">
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
