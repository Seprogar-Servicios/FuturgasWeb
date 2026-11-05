import { requireSupabase } from '../lib/supabase';

export async function signInWithPassword(email: string, password: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error('No se pudo obtener el usuario');

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (adminError) throw adminError;
  if (!admin) {
    await supabase.auth.signOut();
    throw new Error('Tu usuario no tiene permisos de administración');
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
