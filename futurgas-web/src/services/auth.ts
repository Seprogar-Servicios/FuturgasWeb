import { requireSupabase } from '../lib/supabase';

function mapAuthError(error: { message?: string; status?: number; code?: string }) {
  const msg = (error.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos. Si el usuario es nuevo, confirmá el email en Supabase Auth o desactivá “Confirm email”.';
  }
  if (msg.includes('email not confirmed')) {
    return 'El email aún no está confirmado. Confirmalo en Authentication → Users o desactivá “Confirm email”.';
  }
  if (
    msg.includes('permission denied') ||
    msg.includes('not acceptable') ||
    error.code === '42501' ||
    error.status === 403
  ) {
    return 'Sin permisos en la base (403). Ejecutá la migración 006_table_grants.sql y asegurate de tener fila en admin_users.';
  }
  return error.message || 'No se pudo iniciar sesión';
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(mapAuthError(error));

  const userId = data.user?.id;
  if (!userId) throw new Error('No se pudo obtener el usuario');

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (adminError) {
    await supabase.auth.signOut();
    throw new Error(mapAuthError(adminError));
  }
  if (!admin) {
    await supabase.auth.signOut();
    throw new Error(
      'Tu usuario no tiene permisos de administración. Insertá su UUID en public.admin_users.'
    );
  }

  return { session: data.session, user: data.user, role: admin.role as string };
}

export async function signOut() {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentAdmin() {
  const supabase = requireSupabase();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!userData.user) return null;

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, role, user_id, created_at')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (adminError) throw adminError;
  if (!admin) return null;

  return {
    user: userData.user,
    admin,
  };
}
