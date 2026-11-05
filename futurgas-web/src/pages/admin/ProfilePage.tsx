import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, role, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Perfil y sesión</h2>
        <p className="text-muted">Información de la cuenta administrativa.</p>
      </div>

      <div className="max-w-lg space-y-3 rounded-2xl border border-theme fg-admin-panel p-5">
        <p>
          <span className="text-muted">Email:</span> {user?.email}
        </p>
        <p>
          <span className="text-muted">Rol:</span> {role}
        </p>
        <p>
          <span className="text-muted">ID:</span> {user?.id}
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
