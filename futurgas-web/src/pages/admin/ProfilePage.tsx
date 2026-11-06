import { useAuth } from '../../contexts/AuthContext';
import { AdminButton, AdminCard, AdminPageHeader } from '../../components/admin/adminUi';

export default function ProfilePage() {
  const { user, role, logout } = useAuth();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Perfil"
        description="Información de la cuenta administrativa."
      />

      <AdminCard title="Sesión activa" className="max-w-lg">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="mt-0.5 font-semibold text-foreground">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Rol</dt>
            <dd className="mt-0.5 font-semibold text-foreground">{role}</dd>
          </div>
          <div>
            <dt className="text-muted">ID</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-foreground">{user?.id}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <AdminButton type="button" variant="secondary" onClick={() => void logout()}>
            Cerrar sesión
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  );
}
